import {ModelRouter} from '../../common/model-router'
import * as restify from 'restify'
import {Loja} from './lojas.model'

import {authorize} from '../../security/authz.handler'

import {NotFoundError} from 'restify-errors'

class LojasRouter extends ModelRouter<Loja> {

    constructor(){
        super(Loja)
    }

    envelope(document){
        let resource = super.envelope(document)
        resource._links.aplications = `${this.basePath}/${resource._id}/aplications`
        return resource
    }

    findAplications = (req, resp, next)=>{
        Loja.findById(req.params.id, "+aplications")
        .then(rest =>{
            if(!rest){
                throw new NotFoundError('Loja not found')
            }else{
                resp.json(rest.aplications)
                return next()
            }
        }).catch(next)
    }
    replaceAplications = (req, resp, next)=>{
        Loja.findById(req.params.id)
        .then(rest =>{
            if(!rest){
                throw new NotFoundError('Loja not found')
            }else{
                rest.aplications = req.body // Array de MenuItem
                return rest.save()
            }
        }).then(rest =>{
            resp.json(rest.aplications)
            return next()
        }).catch(next)
    }

 applyRoutes(application: restify.Server){

     application.get(`${this.basePath}`, authorize('admin'), this.findAll)
     application.get(`${this.basePath}/:id`, [this.validateId, authorize('admin'), this.findById])
     application.post(`${this.basePath}`, [ authorize('admin'), this.save])
     application.put(`${this.basePath}/:id`, [this.validateId, authorize('admin'), this.replace])
     application.patch(`${this.basePath}/:id`, [this.validateId, authorize('admin'), this.update])
     application.del(`${this.basePath}/:id`, [this.validateId, authorize('admin'), this.delete ])
    
     application.get(`${this.basePath}/:id/aplications`, [this.validateId, authorize('admin'), this.findAplications])
     application.put(`${this.basePath}/:id/aplications`, [this.validateId, authorize('admin'), this.replaceAplications])
     
    }
}

export const lojasRouter = new LojasRouter();