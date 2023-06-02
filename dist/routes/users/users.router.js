"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const model_router_1 = require("../../common/model-router");
const user_model_1 = require("./user.model");
const restify_errors_1 = require("restify-errors");
const auth_handler_1 = require("../../security/auth.handler");
const mongoose = require("mongoose");
const authz_handler_1 = require("../../security/authz.handler");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(user_model_1.User);
        this.findByEmail = (req, resp, next) => {
            if (req.query.email) {
                user_model_1.User.findByEmail(req.query.email)
                    .then(user => {
                    if (user) {
                        return [user];
                    }
                    else {
                        return [];
                    }
                })
                    .then(this.renderAll(resp, next, { pageSize: this.pageSize, url: req.url }))
                    .catch(next);
            }
            else {
                next();
            }
        };
        this.addCarrinho = (req, resp, next) => {
            const options = { runValidators: true, new: true };
            user_model_1.User.findByIdAndUpdate(req.params.id, { $push: { carrinho: req.body } }, options)
                .then(this.render(resp, next))
                .catch(next);
        };
        this.removeItemCarrinho = (req, resp, next) => {
            if (!mongoose.Types.ObjectId.isValid(req.params.idItem)) {
                next(new restify_errors_1.NotFoundError('Document not found'));
            }
            else {
                const options = { runValidators: true, new: true };
                user_model_1.User.findByIdAndUpdate(req.params.id, { $pull: { carrinho: { "_id": req.params.idItem } } }, options)
                    .then(this.render(resp, next))
                    .catch(next);
            }
        };
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, [
            (0, authz_handler_1.authorize)('sysAdminMktPlc', 'admin'),
            this.findByEmail,
            this.findAll
        ]);
        application.get(`${this.basePath}/:id`, [this.validateId, (0, authz_handler_1.authorize)('admin'), (0, authz_handler_1.authorize)('sysAdminMktPlc'), this.findById]);
        application.post(`${this.basePath}`, this.save);
        application.put(`${this.basePath}/:id`, [this.validateId, (0, authz_handler_1.authorize)('admin'), this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateId, (0, authz_handler_1.authorize)('admin'), this.update]);
        application.del(`${this.basePath}/:id`, [this.validateId, (0, authz_handler_1.authorize)('sysAdminMktPlc'), this.delete]);
        application.post(`${this.basePath}/authenticate`, auth_handler_1.authenticate);
        application.post(`${this.basePath}/authenticateSgm`, auth_handler_1.authenticateSGM);
        application.post(`${this.basePath}/:id/carrinho/add`, [this.validateId, this.addCarrinho]);
        application.del(`${this.basePath}/:id/carrinho/:idItem`, [this.validateId, this.removeItemCarrinho]);
    }
}
exports.usersRouter = new UsersRouter();
