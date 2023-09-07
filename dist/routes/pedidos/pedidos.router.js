"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pedidosRouter = void 0;
const model_router_1 = require("../../common/model-router");
const pedidos_model_1 = require("./pedidos.model");
const authz_handler_1 = require("../../security/authz.handler");
const users_router_1 = require("../users/users.router");
class PedidosRouter extends model_router_1.ModelRouter {
    constructor() {
        super(pedidos_model_1.Pedido);
        this.findById = (req, resp, next) => {
            this.model.findById(req.params.id)
                .then(this.render(resp, next))
                .catch(next);
        };
        this.findByLoja = (req, resp, next) => {
            if (req.query.loja) {
                pedidos_model_1.Pedido.findByLoja(req.query.loja, req.query.user, req.query.ativo)
                    .then(user => {
                    if (user) {
                        return user;
                    }
                    else {
                        return [];
                    }
                })
                    .then(res => { this.renderAll(resp.json(res), next, { pageSize: this.pageSize, url: req.url }); })
                    .catch(next);
            }
            else {
                next();
            }
        };
    }
    envelope(document) {
        let resource = super.envelope(document);
        const restId = document.loja._id ? document.loja._id : document.loja;
        resource._links.loja = `/lojas/${restId}`;
        const restCatId = document.user._id ? document.user._id : document.user;
        resource._links.user = `/users/${restCatId}`;
        return resource;
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, [this.findByLoja, this.findAll]);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}/:id`, [users_router_1.usersRouter.clearCarrinho, this.save]);
        application.patch(`${this.basePath}/:id`, [this.validateId, (0, authz_handler_1.authorize)('admin'), this.update]);
    }
}
exports.pedidosRouter = new PedidosRouter();
