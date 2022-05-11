import * as restify from 'restify'
import { NotAuthorizedError, ForbiddenError } from 'restify-errors'
import {User} from '../routes/users/user.model'
import * as jwt from  'jsonwebtoken'
import {environment} from '../common/environment'


export const authenticate: restify.RequestHandler = (req, resp, next) =>{

    const{email, password} = req.body

    User.findByEmail(email, '+password')
    .then(user=>{
        if(user && user.matches(password)){
            //gerar token
            const token = jwt.sign({sub: user.email, iss: 'MarketPlace-API-Manager'},
             environment.security.apiSecret)

             resp.json({id: user._id, name: user.name, profile: profiles[0], accessToken: token})
             return next(false)
        }else{
            return next(new NotAuthorizedError('Invalid Credentials'))
        }
    }).catch(next)
}
export const authenticateSGM: restify.RequestHandler = (req, resp, next) =>{

    const{email, password} = req.body

    User.findByEmail(email, '+password')
    .then(user=>{
        if(user && user.matches(password)){
            let profiles = user.profiles
            if(profiles[0] == "admin" || profiles[0] == "sysAdminMktPlc" ){
                //gerar token
                const token = jwt.sign({sub: user.email, iss: 'MarketPlace-API-Manager'},
                environment.security.apiSecret)

                resp.json({id: user._id, name: user.name, profile: profiles[0], accessToken: token})
                return next(false)
            }else{
                
                next(new ForbiddenError('Permission denied'))
            }
            
        }else{
            return next(new NotAuthorizedError('Invalid Credentials'))
        }
    }).catch(next)
}