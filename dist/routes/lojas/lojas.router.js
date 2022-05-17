"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lojasRouter = void 0;
const model_router_1 = require("../../common/model-router");
const lojas_model_1 = require("./lojas.model");
const authz_handler_1 = require("../../security/authz.handler");
const restify_errors_1 = require("restify-errors");
class LojasRouter extends model_router_1.ModelRouter {
    constructor() {
        super(lojas_model_1.Loja);
        this.findAplications = (req, resp, next) => {
            lojas_model_1.Loja.findById(req.params.id, "+aplications")
                .then(rest => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Loja not found');
                }
                else {
                    resp.json(rest.aplications);
                    return next();
                }
            }).catch(next);
        };
        /*updateAplications = (req, resp, next) => {
            const options = {runValidators:true, new: true}
            
                    Aplication.findByIdAndUpdate(req.params.idLoja, req.body, options)
                    .then(rest =>{
                        if(!rest){
                            throw new NotFoundError('Aplication not found')
                        }else{
                            rest = req.body // Array de MenuItem
                            return rest.save()
                        }
                    }).then(rest =>{
                        resp.json(rest)
                        return next()
                    }).catch(next)
                
            
        }*/
        this.replaceAplications = (req, resp, next) => {
            lojas_model_1.Loja.findById(req.params.id)
                .then(rest => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Loja not found');
                }
                else {
                    rest.aplications = req.body; // Array de MenuItem
                    return rest.save();
                }
            }).then(rest => {
                resp.json(rest.aplications);
                return next();
            }).catch(next);
        };
        this.saveLoja = (req, resp, next) => {
            let document = new this.model(req.body);
            /*console.log(document)
            document.aplications[0].loja = document.id
            document.aplications[1].loja = document.id*/
            document.save()
                .then(this.render(resp, next))
                .catch(next);
        };
    }
    envelope(document) {
        let resource = super.envelope(document);
        resource._links.aplications = `${this.basePath}/${resource._id}/aplications`;
        return resource;
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, (0, authz_handler_1.authorize)('sysAdminMktPlc'), this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, [(0, authz_handler_1.authorize)('sysAdminMktPlc'), this.saveLoja]);
        application.put(`${this.basePath}/:id`, [this.validateId, (0, authz_handler_1.authorize)('sysAdminMktPlc'), this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateId, (0, authz_handler_1.authorize)('sysAdminMktPlc'), this.update]);
        application.del(`${this.basePath}/:id`, [this.validateId, (0, authz_handler_1.authorize)('sysAdminMktPlc'), this.delete]);
        /* application.get(`${this.basePath}/:id/aplications`, [this.validateId, authorize('admin'), this.findAplications])
         application.put(`${this.basePath}/:id/aplications`, [this.validateId, authorize('admin'), this.replaceAplications])
         */
    }
}
exports.lojasRouter = new LojasRouter();
