import {ModelRouter} from '../../common/model-router'
import * as restify from 'restify'
import {User} from './user.model'
import {NotFoundError} from 'restify-errors'
import { version } from 'mongoose'
import {authenticate, authenticateSGM} from '../../security/auth.handler'

import * as mongoose from 'mongoose'
import {authorize} from '../../security/authz.handler'

class UsersRouter extends ModelRouter<User> {

    constructor(){
        super(User)
        this.on('beforeRender', document =>{
            document.password = undefined
            
        })
    }

    findByEmail = (req, resp, next) =>{
        if(req.query.email){
            User.findByEmail(req.query.email)
            .then(user => {
                if(user){
                    return [user]
                }else{
                    return []
                }
            })
            .then(this.renderAll(resp, next, {pageSize: this.pageSize, url: req.url}))
            .catch(next)
        }else{
            next()
        }
    }
    addCarrinho: restify.RequestHandler = (req, resp, next) => {
        const options = { runValidators: true, new: true }
        User.findByIdAndUpdate(req.params.id, { $push: { carrinho: req.body  } }, options)
        .then(this.renderCarrinho(resp, next))
        .catch(next)
    }
    renderCarrinho(response: restify.Response, next: restify.Next){
        return (document)=>{
            if(document){
                this.emit('beforeRender', document)
                response.json(document.carrinho)
            }else{
                throw new NotFoundError('Documento não encontrado')
            }
            return next(false)
        }
    }
    getCarrinho: restify.RequestHandler = (req, resp, next) => {
        User.findById(req.params.id)
        .then(this.renderCarrinho(resp, next))
        .catch(next)
    }
    removeItemCarrinho: restify.RequestHandler = (req, resp, next) => {
        if(!mongoose.Types.ObjectId.isValid(req.params.idItem)){
            next(new NotFoundError('Document not found'));
        } else {
            const options = { runValidators: true, new: true }
            User.findByIdAndUpdate(req.params.id, { $pull: { carrinho: { "_id": req.params.idItem }  } }, options)
            .then(this.renderCarrinho(resp, next))
            .catch(next)
        }
    }


    // Endereço

    addEndereco: restify.RequestHandler = (req, resp, next) => {
        const options = { runValidators: true, new: true }
        User.findByIdAndUpdate(req.params.id, { $push: { enderecos: req.body  } }, options)
        .then(this.renderEnderecos(resp, next))
        .catch(next)
    }
    renderEnderecos(response: restify.Response, next: restify.Next){
        return (document)=>{
            if(document){
                this.emit('beforeRender', document)
                response.json(document.enderecos)
            }else{
                throw new NotFoundError('Documento não encontrado')
            }
            return next(false)
        }
    }
    getEnderecos: restify.RequestHandler = (req, resp, next) => {
        User.findById(req.params.id)
        .then(this.renderEnderecos(resp, next))
        .catch(next)
    }
    removeItemEndereco: restify.RequestHandler = (req, resp, next) => {
        if(!mongoose.Types.ObjectId.isValid(req.params.idItem)){
            next(new NotFoundError('Document not found'));
        } else {
            const options = { runValidators: true, new: true }
            User.findByIdAndUpdate(req.params.id, { $pull: { enderecos: { "_id": req.params.idItem }  } }, options)
            .then(this.renderEnderecos(resp, next))
            .catch(next)
        }
    }

    

    applyRoutes(application: restify.Server){

        application.get(`${this.basePath}`, [
            authorize('sysAdminMktPlc', 'admin'),
            this.findByEmail,
            this.findAll])
        application.get(`${this.basePath}/:id`, [this.validateId, authorize('admin'), authorize('sysAdminMktPlc'), this.findById])
        application.post(`${this.basePath}`,  this.save)
        application.put(`${this.basePath}/:id`, [this.validateId, authorize('admin'), this.replace])
        application.patch(`${this.basePath}/:id`, [this.validateId, authorize('admin'), this.update])
        application.del(`${this.basePath}/:id`, [this.validateId, authorize('sysAdminMktPlc'), this.delete ])
        
        application.post(`${this.basePath}/authenticate`, authenticate)
        application.post(`${this.basePath}/authenticateSgm`, authenticateSGM)


        application.post(`${this.basePath}/:id/carrinho/add`, [this.validateId, this.addCarrinho])
        application.get(`${this.basePath}/:id/carrinho`, [this.validateId, this.getCarrinho])
        application.del(`${this.basePath}/:id/carrinho/:idItem`, [this.validateId, this.removeItemCarrinho])

        application.post(`${this.basePath}/:id/enderecos/add`, [this.validateId, this.addEndereco])
        application.get(`${this.basePath}/:id/enderecos`, [this.validateId, this.getEnderecos])
        application.del(`${this.basePath}/:id/enderecos/:idItem`, [this.validateId, this.removeItemEndereco])
        
    }
}

export const usersRouter = new UsersRouter();