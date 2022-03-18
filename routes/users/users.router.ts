import {ModelRouter} from '../../common/model-router'
import * as restify from 'restify'
import {User} from './user.model'
import {NotFoundError} from 'restify-errors'
import { version } from 'mongoose'
import {authenticate} from '../../security/auth.handler'
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

    applyRoutes(application: restify.Server){

        application.get(`${this.basePath}`, [
            authorize('sysAdminMktPlc'),
            this.findByEmail,
            this.findAll])
        application.get(`${this.basePath}/:id`, [this.validateId, authorize('admin'), authorize('sysAdminMktPlc'), this.findById])
        application.post(`${this.basePath}`,  this.save)
        application.put(`${this.basePath}/:id`, [this.validateId, authorize('admin'), this.replace])
        application.patch(`${this.basePath}/:id`, [this.validateId, authorize('admin'), this.update])
        application.del(`${this.basePath}/:id`, [this.validateId, authorize('sysAdminMktPlc'), this.delete ])
        
        application.post(`${this.basePath}/authenticate`, authenticate)
        
    }
}

export const usersRouter = new UsersRouter();