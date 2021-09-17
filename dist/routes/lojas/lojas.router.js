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
    }
    envelope(document) {
        let resource = super.envelope(document);
        resource._links.aplications = `${this.basePath}/${resource._id}/aplications`;
        return resource;
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, authz_handler_1.authorize('admin'), this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, authz_handler_1.authorize('admin'), this.findById]);
        application.post(`${this.basePath}`, [authz_handler_1.authorize('admin'), this.save]);
        application.put(`${this.basePath}/:id`, [this.validateId, authz_handler_1.authorize('admin'), this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateId, authz_handler_1.authorize('admin'), this.update]);
        application.del(`${this.basePath}/:id`, [this.validateId, authz_handler_1.authorize('admin'), this.delete]);
        application.get(`${this.basePath}/:id/aplications`, [this.validateId, authz_handler_1.authorize('admin'), this.findAplications]);
        application.put(`${this.basePath}/:id/aplications`, [this.validateId, authz_handler_1.authorize('admin'), this.replaceAplications]);
    }
}
exports.lojasRouter = new LojasRouter();
