import {ModelRouter} from '../../common/model-router'
import * as restify from 'restify'
import {Pedido} from './pedidos.model'
import {NotFoundError} from 'restify-errors'
import {Loja} from "../lojas/lojas.model"

import {authorize} from '../../security/authz.handler'
import { User } from '../users/user.model'

class PedidosRouter extends ModelRouter<Pedido> {

    constructor(){
        super(Pedido)
    }
    envelope(document){
        let resource = super.envelope(document)
        const restId = document.loja._id ? document.loja._id : document.loja
        resource._links.loja = `/lojas/${restId}`
        const restCatId = document.user._id ? document.user._id : document.user
        resource._links.user = `/users/${restCatId}`
        return resource
    }

    findById = (req, resp, next) => {
        this.model.findById(req.params.id)
        .then(this.render(resp, next))
        .catch(next)
    }
    compareStatus = async (novoStatus, id, next): Promise<boolean> => {
        var status = await this.model.findById(id)
            .then((pedido) => {
                if (pedido.status < novoStatus) {
                    return true
                } else {
                    return false
                }
            })
            .catch(() => {return false})
        return status
    }
    clearCart: restify.RequestHandler = (req, resp, next) => {
        const options = { runValidators: true, new: true }
        User.findByIdAndUpdate(req.body.user,  { carrinho: []  }, options)
        .then(this.save(req, resp, next))
        .catch(next)
    }
    aprovarPedido: restify.RequestHandler = async (req, resp, next) => {
        const options = { runValidators: true, new: true }
        var status = 2
        var pagamentoPresencial = true
        if (pagamentoPresencial) {
            status = 3
        }
        var compare = await this.compareStatus(status, req.params.id, next)
        if (compare) {
            this.model.findByIdAndUpdate(req.params.id,  { status: status }, options)
            .then(() => { next() }).catch(next)
        } else {
            next(new NotFoundError('Invalid status'))
        }

    }
    setarPagoPedido: restify.RequestHandler = async (req, resp, next) => {
        const options = { runValidators: true, new: true }
        var status = 3
        var compare = await this.compareStatus(status, req.params.id, next)
        if (compare) {
            this.model.findByIdAndUpdate(req.params.id,  { status: status }, options)
            .then(() => { next() }).catch(next)
        } else {
            next(new NotFoundError('Invalid status'))
        }

    }
    setarEntregaPedido: restify.RequestHandler = async (req, resp, next) => {
        const options = { runValidators: true, new: true }
        var status = 4
        var compare = await this.compareStatus(status, req.params.id, next)
        if (compare) {
            this.model.findByIdAndUpdate(req.params.id,  { status: status }, options)
            .then(() => { next() }).catch(next)
        } else {
            next(new NotFoundError('Invalid status'))
        }
    }
    setarFinalizarPedido: restify.RequestHandler = async (req, resp, next) => {
        const options = { runValidators: true, new: true }
        var status = 5
        var compare = await this.compareStatus(status, req.params.id, next)
        if (compare) {
            this.model.findByIdAndUpdate(req.params.id,  { status: status }, options)
            .then(() => { next() }).catch(next)
        } else {
            next(new NotFoundError('Invalid status'))
        }
    }
    cancelarPedido: restify.RequestHandler = async (req, resp, next) => {
        const options = { runValidators: true, new: true }
        var status = 6
        var compare = await this.compareStatus(status, req.params.id, next)
        if (compare) {
            this.model.findByIdAndUpdate(req.params.id,  { status: status }, options)
            .then(() => { next() }).catch(next)
        } else {
            next(new NotFoundError('Invalid status'))
        }
    }
    
    findByLoja = (req, resp, next) =>{
        if(req.query.loja){
            Pedido.findByLoja(req.query.loja, req.query.user, req.query.ativo)
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
        application.post(`${this.basePath}`, [this.validateId, this.clearCart])
        application.post(`${this.basePath}/:id/aprovar`, [this.validateId, this.aprovarPedido, this.findById])
        application.post(`${this.basePath}/:id/pago`, [this.validateId, this.setarPagoPedido, this.findById])
        application.post(`${this.basePath}/:id/entrega`, [this.validateId, this.setarEntregaPedido, this.findById])
        application.post(`${this.basePath}/:id/finalizar`, [this.validateId, this.setarFinalizarPedido, this.findById])
        application.post(`${this.basePath}/:id/cancelar`, [this.validateId, this.cancelarPedido, this.findById])
        application.patch(`${this.basePath}/:id`, [this.validateId, authorize('admin'), this.update])
      }
}

export const pedidosRouter = new  PedidosRouter();