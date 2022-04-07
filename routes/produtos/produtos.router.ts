import {ModelRouter} from '../../common/model-router'
import * as restify from 'restify'
import {Produto} from './produtos.model'
import {NotFoundError} from 'restify-errors'
import {Loja} from "../lojas/lojas.model"


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
    

    applyRoutes(application: restify.Server){

        application.get(`${this.basePath}`, [this.findByLoja, this.findAll])
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(`${this.basePath}`, [ this.save])
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update])
      }
}

export const produtosRouter = new   ProdutosRouter();