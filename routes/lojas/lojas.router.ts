import {ModelRouter} from '../../common/model-router'
import * as restify from 'restify'
import {Loja} from './lojas.model'



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
    /*updateAplications = (req, resp, next) => {
        const options = {runValidators:true, new: true}
        
                Aplication.findByIdAndUpdate(req.params.idLoja, req.body, options)
                .then(rest =>{
                    if(!rest){
                        throw new NotFoundError('Aplication not found')
                    }else{
                        rest = req.body // Array de MenuItem
                        return rest.save()
                    }
                }).then(rest =>{
                    resp.json(rest)
                    return next()
                }).catch(next)
            
        
    }*/
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
    saveLoja = (req, resp, next)=>{
        let document = new this.model(req.body);
        console.log(document)
        document.aplications[0].loja = document.id
        document.aplications[1].loja = document.id
        document.save()
        .then(this.render(resp, next))
        .catch(next)
    }

 applyRoutes(application: restify.Server){

     application.get(`${this.basePath}`, this.findAll)
     application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
     application.post(`${this.basePath}`, [ this.saveLoja])
     application.put(`${this.basePath}/:id`, [this.validateId, this.replace])
     application.patch(`${this.basePath}/:id`, [this.validateId, this.update])
     application.del(`${this.basePath}/:id`, [this.validateId, this.delete ])
    
    /* application.get(`${this.basePath}/:id/aplications`, [this.validateId, authorize('admin'), this.findAplications])
     application.put(`${this.basePath}/:id/aplications`, [this.validateId, authorize('admin'), this.replaceAplications])
     */
    }
}

export const lojasRouter = new LojasRouter();