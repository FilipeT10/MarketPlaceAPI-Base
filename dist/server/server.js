"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const restify = require("restify");
const environment_1 = require("../common/environment");
const mongoose = require("mongoose");
const error_handler_1 = require("./error.handler");
const merge_patch_parses_1 = require("./merge-patch.parses");
const token_parser_1 = require("../security/token.parser");
const logger = require("morgan");
const cors = require("cors");
const whitelist = ["http://192.168.1.7:3000"];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    exposedHeaders: '*',
    preflightContinue: false,
    credentials: true,
};
class Server {
    initializeDb() {
        mongoose.Promise = global.Promise;
        return mongoose.connect(environment_1.environment.db.url, { useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'MarketPlace-API-Manager',
                    version: '1.0.0',
                });
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_patch_parses_1.mergePatchBodyParser);
                this.application.use(token_parser_1.tokenParser);
                this.application.use(logger("dev"));
                this.application.use(cors(corsOptions));

                this.application.use((req, res, next) => {
                    res.header("Access-Control-Allow-Origin", "*");
                    res.header(
                      "Access-Control-Allow-Headers",
                      "Origin, X-Requested-With, Content-Type, Accept, Authorization, 'Content-Type' : 'multipart/form-data' ,* "
                    );
                    res.header(
                      "Access-Control-Allow-Methods",
                      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
                    );
                    next();
                  });
                  
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                this.application.get('/info', (req, resp, next) => {
                    resp.json({
                        browser: req.userAgent(),
                        method: req.method,
                        url: req.href(),
                        path: req.path(),
                        query: req.query
                    });
                    return next();
                });
                this.application.listen(environment_1.environment.server.port, () => {
                    console.log('API is running on ' + this.application.url);
                    resolve(this.application);
                });
                this.application.on('restifyError', error_handler_1.handleError);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this));
        //return this.initRoutes(routers).then(()=> this)
    }
    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }
}
exports.Server = Server;
