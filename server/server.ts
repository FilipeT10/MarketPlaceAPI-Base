import * as restify from 'restify'
import {environment} from '../common/environment'
import {Router} from '../common/router'
import * as mongoose from 'mongoose'
import { handleError } from './error.handler'
import {mergePatchBodyParser} from './merge-patch.parses'
import {tokenParser} from "../security/token.parser"
import * as logger from 'morgan'
import { verifyCupomPromo } from '../functions/verify.cupom.promo.handler'

var corsMiddleware = require('restify-cors-middleware');

var cors = corsMiddleware({
        preflightMaxAge: 5,
        origins: ['*'],
        allowHeaders:['X-App-Version', 'Authorization'],
        exposeHeaders:[]
      });
export class Server{

        application: restify.Server


    initializeDb(){

        (<any>mongoose).Promise = global.Promise
        return mongoose.connect(environment.db.url, 
            { useNewUrlParser: true,
                useUnifiedTopology: true 
            }
            )
    }


    initRoutes(routers: Router[]): Promise<any>{
        return new Promise((resolve, reject)=>{
            try{

                this.application = restify.createServer({
                    name: 'MarketPlace-API-Manager',
                    version: '1.0.0',
                    
                })
                this.application.pre(cors.preflight);
                this.application.use(cors.actual);
                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                this.application.use(mergePatchBodyParser)
                this.application.use(tokenParser)
                this.application.use(logger("dev"))

                
                for (let router of routers){
                    router.applyRoutes(this.application)
                }
                
                this.application.get('/info', (req, resp, next) =>{
                    resp.json({
                        browser: req.userAgent(),
                        method: req.method,
                        url: req.href(),
                        path: req.path(),
                        query: req.query
                    });
                    return next();
                })

                this.application.listen(environment.server.port, ()=>{
                    console.log('API is running on '+this.application.url)
                    resolve(this.application)
                    verifyCupomPromo()
                })

                this.application.on('restifyError', handleError)

            }catch(error){
                reject(error);
            }
        })
    }

    bootstrap(routers: Router[] = []): Promise<Server>{
        return this.initializeDb().then(()=>
        this.initRoutes(routers).then(()=> this))
        //return this.initRoutes(routers).then(()=> this)
    }

    shutdown(){
        return mongoose.disconnect().then(()=>this.application.close())
    }
}