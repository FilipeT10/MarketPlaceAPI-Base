import {ModelRouter} from '../../common/model-router'
import * as restify from 'restify'
import {Cupom} from './cupons.model'
import {NotFoundError} from 'restify-errors'
import {authorize} from '../../security/authz.handler'

class CuponsRouter extends ModelRouter<Cupom> {

    constructor(){
        super(Cupom)
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

    cadastrarCupom: restify.RequestHandler = async (req, resp, next) => {
        if (new Date(req.body.periodoFinal) <= new Date()) {
            next(new NotFoundError('Período final inválido!'))
        }
        

        let document = new this.model(req.body);
        this.model.create(document)
            .then((doc) => {
                const tempoRestante = new Date(req.body.periodoFinal) - new Date();
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