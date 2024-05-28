import {ModelRouter} from '../../common/model-router'
import * as restify from 'restify'
import {Pedido} from './pedidos.model'
import {BadRequestError, NotFoundError} from 'restify-errors'
import {authorize} from '../../security/authz.handler'
import { User } from '../users/user.model'
import { Produto } from '../produtos/produtos.model'
import { notification } from '../../functions/notifications.handler'

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
        .then(() =>{this.save(req, resp, next)})
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
                .then((pedido) => {
                    resp.json(200, pedido)
                    resp.end()
                    notification("Pedido aprovado!", "O seu pedido "+pedido.numeroPedido+" foi aprovado.", String(pedido.user), req, resp, next)
                }).catch(next)
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
                .then((pedido) => {
                    resp.json(200, pedido)
                    resp.end()
                    notification("Pagamento efetuado!", "O pagamento do seu pedido "+pedido.numeroPedido+" foi efetuado.", String(pedido.user), req, resp, next)
                }).catch(next)
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
                .then((pedido) => {
                    resp.json(200, pedido)
                    resp.end()
                    notification("Pedido a caminho!", "O seu pedido "+pedido.numeroPedido+" está em processo de entrega.", String(pedido.user), req, resp, next)
                }).catch(next)
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
                .then((pedido) => {
                    resp.json(200, pedido)
                    resp.end()
                    notification("Pedido finalizado!", "O seu pedido "+pedido.numeroPedido+" foi finalizado.", String(pedido.user), req, resp, next)
                }).catch(next)
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
                .then((pedido) => {
                    resp.json(200, pedido)
                    resp.end()
                    notification("Pedido cancelado!", "O seu pedido "+pedido.numeroPedido+" foi cancelado.", String(pedido.user), req, resp, next)
                }).catch(next)
        } else {
            next(new NotFoundError('Invalid status'))
        }
    }

    consultarSubtotal: restify.RequestHandler = async (req, resp, next) => {
        if (!req.params.loja) {
            return next(new BadRequestError('Loja inválida!'))
        }
        let products: [Produto] = req.body;
        
        if (products == undefined || products.length < 1) {
            return next(new BadRequestError('Produtos inválidos!'))
        }
        let valorTotal = 0;
        try {
            await Promise.all(products.map(async (id) => {
                var item = await Produto.findOne({ _id: id });
                valorTotal += Number(item.promocao ? item.promocao.preco : item.preco);
            }))
            
            resp.json({valorTotal})
            resp.end();
        } catch (e) {
            return next(new BadRequestError('Erro ao calcular o valor.'))
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
        application.post(`${this.basePath}`, [ this.clearCart])
        application.post(`${this.basePath}/:id/aprovar`, [this.validateId, authorize('admin'), this.aprovarPedido])
        application.post(`${this.basePath}/:id/pago`, [this.validateId, authorize('admin'), this.setarPagoPedido])
        application.post(`${this.basePath}/:id/entrega`, [this.validateId, authorize('admin'), this.setarEntregaPedido])
        application.post(`${this.basePath}/:id/finalizar`, [this.validateId, authorize('admin'), this.setarFinalizarPedido])
        application.post(`${this.basePath}/:id/cancelar`, [this.validateId, this.cancelarPedido])
        application.patch(`${this.basePath}/:id`, [this.validateId, authorize('admin'), this.update])
        application.post(`${this.basePath}/subtotal/:loja`, [this.consultarSubtotal])
      }
}

export const pedidosRouter = new  PedidosRouter();