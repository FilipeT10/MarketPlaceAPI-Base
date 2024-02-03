import {ModelRouter} from '../../common/model-router'
import * as restify from 'restify'
import {Cupom} from './cupons.model'
import {BadRequestError, ConflictError} from 'restify-errors'
import {authorize} from '../../security/authz.handler'
import { ProdutoPedido } from '../models/produtopedido.model'
import { Produto } from '../produtos/produtos.model'
import { User } from '../users/user.model'
import { Pedido } from '../pedidos/pedidos.model'

class CuponsRouter extends ModelRouter<Cupom> {

    constructor(){
        super(Cupom)
    }
    envelope(document){
        let resource = super.envelope(document)
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
            Cupom.findByLoja(req.query.loja, req.query.categoria, req.query.ativo)
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


    
    desativarCupom = async (id, periodoFinal) => {
        const options = { runValidators: true, new: true }
        
        this.model.findByIdAndUpdate(id,  { ativo: false }, options)
            .then(() => {
                console.log("Cupom desativado", periodoFinal, new Date() )
            }).catch(() => console.log("Não foi possível desativar o cupom", periodoFinal, new Date() ))

    }

    validaCupom = async (name: string): Promise<boolean> => {
        var cupom = await this.model.findOne({ name });
        if (!cupom) {
            return true
        }
        return false
    }

    aplicaCupom: restify.RequestHandler = async (req, resp, next) => {
        if (!req.params.name) {
            next(new BadRequestError('Informe o cupom!'))
        }
        if (!req.params.valor) {
            next(new BadRequestError('Informe o valor total!'))
        }
        if (!req.params.loja) {
            next(new BadRequestError('Informe a loja!'))
        }
        var cupom = await this.model.findOne({ name: req.params.name, loja: req.params.loja });
        if (!cupom) {
            next(new ConflictError('Cupom inválido!'))
        } else if (new Date() > cupom.periodoFinal ) {
            next(new ConflictError('Cupom expirado!'))
        } else if (new Date() < cupom.periodoInicial ) {
            next(new ConflictError('Cupom inválido!'))
        }
        return false
    }

    cadastrarCupom: restify.RequestHandler = async (req, resp, next) => {
        if (new Date(req.body.periodoFinal) <= new Date()) {
            next(new BadRequestError('Período final inválido!'))
        }
        const tempoRestante = new Date(req.body.periodoFinal) - new Date();
        //20 dias
        if (tempoRestante > 1728000000) {
            next(new BadRequestError('O intervalo máximo permitido é de 20 dias.'))
        }
        var valid = await this.validaCupom(req.body.name);
        if (!valid) {
            next(new ConflictError('Já possui um cupom cadastrado com esse nome.'))
        }

        let document = new this.model(req.body);
        this.model.create(document)
            .then((doc) => {
                setTimeout(() => this.desativarCupom(req.params.id, req.body.periodoFinal), tempoRestante);
                resp.json(doc)
                resp.end();
            })
        .catch(next)
    }

    consultarCupom: restify.RequestHandler = async (req, resp, next) => {
        if (!req.params.loja) {
            return next(new BadRequestError('Loja inválida!'))
        }
        if (!req.params.name) {
            return next(new BadRequestError('Cupom inválido!'))
        }
        var cupom = await this.model.findOne({ name: req.params.name, loja: req.params.loja });
        if (!cupom) {
            return next(new ConflictError('Não possui nenhum cupom cadastrado com esse nome.'))
        }
        if (!cupom.ativo) {
            return next(new ConflictError('Cupom expirado ou inativo.'))
        }

        let products: [Produto] = req.body;
        
        if (products == undefined || products.length < 1) {
            return next(new BadRequestError('Produtos inválidos!'))
        }
        let valorTotal = 0;
        let valorCorrigido = 0;
        let valorDesconto = 0;

        try {
            await Promise.all(products.map(async (id) => {
                var item = await Produto.findOne({ _id: id });
                valorTotal += Number(item.preco);
            }))
            await Promise.all(products.map(async (id) => {
                var item = await Produto.findOne({ _id: id });
                if (!item) {
                    return next(new BadRequestError('Não foi possível encontrar o produto!'))
                }
                if (item.loja != req.params.loja) {
                    return next(new BadRequestError('Não foi possível encontrar o produto na loja!'))
                }
                var valorDescontoCupom = 0;
                if (cupom.condicao == 'all' || cupom.categorias.includes(item.categoria) || cupom.subcategorias.some(id => item.subcategorias.includes(id))) {
                    var pedidoList = await Pedido.find({ loja: req.params.loja, user: req.authenticated._id });
                    if ((cupom.condicao == 'PC' && pedidoList.length < 1) || (cupom.condicao == ">" && cupom.valorCondicao && valorTotal >= cupom.valorCondicao ) || cupom.condicao == 'all') {
                        if (cupom.tipo == "$") {
                            valorDescontoCupom = Number(cupom.valor);
                        } else if (cupom.tipo == "%") {
                            let valorOriginal = Number(item.preco);
                            let porcentagemParaSubtrair = cupom.valor; 
                            let porcentagemDecimal = porcentagemParaSubtrair / 100;
                            let valorDaPorcentagem = valorOriginal * porcentagemDecimal;
                            valorDescontoCupom = Number(valorDaPorcentagem);
                        }
                    }
                }
                let descontoItem = Number(item.preco) - valorDescontoCupom

                valorDesconto += valorDescontoCupom;
                valorCorrigido += descontoItem;

            }))
            resp.json({valorCorrigido: valorCorrigido, valorDesconto, valorTotal})
            resp.end();
        } catch (e) {
            return next(new ConflictError('Erro ao calcular a aplicação do cupom.'))
        } 
    }
    

    applyRoutes(application: restify.Server){

        application.get(`${this.basePath}`, [this.findByLoja, this.findAll])
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(`${this.basePath}`, [authorize('admin'), this.cadastrarCupom])
        application.patch(`${this.basePath}/:id`, [this.validateId, authorize('admin'), this.update])
        application.post(`${this.basePath}/consulta/:loja/:name`, [this.consultarCupom])
      }
}

export const cuponsRouter = new CuponsRouter();