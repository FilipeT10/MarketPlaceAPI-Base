"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const model_router_1 = require("../../common/model-router");
const user_model_1 = require("./user.model");
const auth_handler_1 = require("../../security/auth.handler");
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
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, [
            (0, authz_handler_1.authorize)('sysAdminMktPlc'),
            this.findByEmail,
            this.findAll
        ]);
        application.get(`${this.basePath}/:id`, [this.validateId, (0, authz_handler_1.authorize)('admin'), (0, authz_handler_1.authorize)('sysAdminMktPlc'), this.findById]);
        application.post(`${this.basePath}`, this.save);
        application.put(`${this.basePath}/:id`, [this.validateId, (0, authz_handler_1.authorize)('admin'), this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateId, (0, authz_handler_1.authorize)('admin'), this.update]);
        application.del(`${this.basePath}/:id`, [this.validateId, (0, authz_handler_1.authorize)('sysAdminMktPlc'), this.delete]);
        application.post(`${this.basePath}/authenticate`, auth_handler_1.authenticate);
    }
}
exports.usersRouter = new UsersRouter();
