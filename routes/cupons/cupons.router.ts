import {ModelRouter} from '../../common/model-router'
import * as restify from 'restify'
import {Cupom} from './cupons.model'
import {BadRequestError, ConflictError} from 'restify-errors'
import {authorize} from '../../security/authz.handler'

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
    

    applyRoutes(application: restify.Server){

        application.get(`${this.basePath}`, [this.findByLoja, this.findAll])
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(`${this.basePath}`, [authorize('admin'), this.cadastrarCupom])
        application.patch(`${this.basePath}/:id`, [this.validateId, authorize('admin'), this.update])
      }
}

export const cuponsRouter = new CuponsRouter();