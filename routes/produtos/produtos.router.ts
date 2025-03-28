import {ModelRouter} from '../../common/model-router'
import * as restify from 'restify'
import {Produto} from './produtos.model'
import {BadRequestError} from 'restify-errors'
import {authorize} from '../../security/authz.handler'
import { notificationAll } from '../../functions/notifications.handler'
import { dateFormat } from '../../common/formatter'

class ProdutosRouter extends ModelRouter<Produto> {

    constructor(){
        super(Produto)
    }
    envelope(document){
        let resource = super.envelope(document)
        const restId = document.loja._id ? document.loja._id : document.loja
        resource._links.loja = `/lojas/${restId}`
        const restCatId = document.categoria._id ? document.categoria._id : document.categoria
        resource._links.categoria = `/categorias/${restCatId}`
        return resource
    }

    findById = (req, resp, next) => {
        this.model.findById(req.params.id)
        .populate('loja', 'name')
        .populate('categoria', 'name')
        .then(this.render(resp, next))
        .catch(next)
    }
    
    findByLoja = (req, resp, next) =>{
        if(req.query.loja){
            Produto.findByLoja(req.query.loja, req.query.categoria, req.query.ativo)
            .then(user => {

                if(user){
                    return user
                }else{
                    return []
                }
            })
            .then( res => { this.renderAll(resp.json(res), next, {pageSize: this.pageSize, url: req.url})})
            .catch(next)
        }else{
            next()
        }
    }

    validaPromo = async (id): Promise<boolean> => {
        var contemPromocao = await this.model.findById(id)
            .then((produto) => {
                if (!produto.promocao) {
                    return true
                } else {
                    return false
                }
            })
            .catch(() => {return false})
        return contemPromocao
    }

    removerPromocaoProdutoServico: restify.RequestHandler = async (req, resp, next) => {
        const options = { runValidators: true, new: true }
        var valid = await this.validaPromo(req.params.id)
        if (!valid) {
            this.model.findByIdAndUpdate(req.params.id,  { promocao: null }, options)
                .then((produto) => {
                    resp.json(200, produto)
                    resp.end()
                }).catch(next)
        } else {
            next(new BadRequestError('Não possui promoção em andamento!'))
        }
    }

    removerPromocaoProduto = async (id, periodoFinal) => {
        const options = { runValidators: true, new: true }
        var valid = await this.validaPromo(id)
        if (!valid) {
            this.model.findByIdAndUpdate(id,  { promocao: null }, options)
                .then(() => {
                    console.log("Promoção removida do produto", periodoFinal, new Date() )
                }).catch(() => console.log("Não foi possível remover promoção do produto", periodoFinal, new Date() ))
        }
    }

    cadastrarPromocaoProduto: restify.RequestHandler = async (req, resp, next) => {
        if (new Date(req.body.periodoFinal) <= new Date()) {
            return next(new BadRequestError('Período final inválido!'))
        }
        const tempoRestante = new Date(req.body.periodoFinal) - new Date();
        if (tempoRestante > 1728000000) {
            return next(new BadRequestError('O intervalo máximo permitido é de 20 dias.'))
        }
        const options = { runValidators: true, new: true }
        var valid = await this.validaPromo( req.params.id)
        if (valid) {
            this.model.findByIdAndUpdate(req.params.id,  { promocao: req.body }, options)
                .then((produto) => {
                    setTimeout(() => this.removerPromocaoProduto(req.params.id, req.body.periodoFinal), tempoRestante);
                    resp.json(200, produto)
                    resp.end()
                    notificationAll("Promoção", req.body.descricao+"\nDisponível entre: "+dateFormat(new Date(req.body.periodoInicial))+" a "+dateFormat(new Date(req.body.periodoFinal)), req, resp, next)
                    
                }).catch(next)
        } else {
            next(new BadRequestError('Já possui promoção em andamento!'))
        }
    }
    

    applyRoutes(application: restify.Server){

        application.get(`${this.basePath}`, [this.findByLoja, this.findAll])
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(`${this.basePath}`, [authorize('admin'), this.save])
        application.patch(`${this.basePath}/:id`, [this.validateId, authorize('admin'), this.update])
        application.post(`${this.basePath}/:id/cadastrarPromocao`, [this.validateId, authorize('admin'), this.cadastrarPromocaoProduto, this.findById])
        application.post(`${this.basePath}/:id/removerPromocao`, [this.validateId, authorize('admin'), this.removerPromocaoProdutoServico, this.findById])
    }
}

export const produtosRouter = new   ProdutosRouter();