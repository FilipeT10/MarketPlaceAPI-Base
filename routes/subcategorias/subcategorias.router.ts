import {ModelRouter} from '../../common/model-router'
import * as restify from 'restify'
import {SubCategoria} from './subcategorias.model'
import {NotFoundError} from 'restify-errors'
import {Loja} from "../lojas/lojas.model"

import {authorize} from '../../security/authz.handler'

class SubCategoriasRouter extends ModelRouter<SubCategoria> {

    constructor(){
        super(SubCategoria)
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
    
    findByLoja = (req, resp, next) =>{
        if(req.query.loja){
            SubCategoria.findByLoja(req.query.loja, req.query.ativo)
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
    

    applyRoutes(application: restify.Server){

        application.get(`${this.basePath}`, [this.findByLoja, this.findAll])
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(`${this.basePath}`, [authorize('admin'), this.save])
        application.patch(`${this.basePath}/:id`, [this.validateId, authorize('admin'), this.update])
     
      }
}

export const subcategoriasRouter = new SubCategoriasRouter();