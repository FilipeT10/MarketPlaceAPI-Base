import {Router} from './common/router'
import * as restify from 'restify'

class MainRouter extends Router{
    applyRoutes(application: restify.Server){
        application.get('/', (req, resp, next) =>{
            resp.json({
                users: '/users',
                restaurants: '/restaurants',
                reviews: '/reviews',
                lojas: '/lojas',
                aplications: '/aplications'
            })
        })
    }
}

export const mainRouter = new MainRouter()