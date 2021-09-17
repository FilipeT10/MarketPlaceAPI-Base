import {ModelRouter} from '../../common/model-router'
import * as restify from 'restify'
import {Aplication} from './aplications.model'
import {NotFoundError} from 'restify-errors'


class AplicationsRouter extends ModelRouter<Aplication> {

    constructor(){
        super(Aplication)
    }
    envelope(document){
        let resource = super.envelope(document)
        const restId = document.loja._id ? document.loja._id : document.loja
        resource._links.loja = `/lojas/${restId}`
        return resource
    }

    findById = (req, resp, next) => {
        this.model.findById(req.params.id)
        .populate('loja', 'name')
        .then(this.render(resp, next))
        .catch(next)
    }

    applyRoutes(application: restify.Server){

        application.get(`${this.basePath}`, this.findAll)
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(`${this.basePath}`, this.save)
      }
}

export const aplicationsRouter = new AplicationsRouter();