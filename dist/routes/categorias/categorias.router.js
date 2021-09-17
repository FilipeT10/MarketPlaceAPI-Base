"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriasRouter = void 0;
const model_router_1 = require("../../common/model-router");
const categorias_model_1 = require("./categorias.model");
const authz_handler_1 = require("../../security/authz.handler");
class CategoriasRouter extends model_router_1.ModelRouter {
    constructor() {
        super(categorias_model_1.Categoria);
        this.findById = (req, resp, next) => {
            this.model.findById(req.params.id)
                .populate('loja', 'name')
                .then(this.render(resp, next))
                .catch(next);
        };
        this.findByLoja = (req, resp, next) => {
            if (req.query.loja) {
                categorias_model_1.Categoria.findByLoja(req.query.loja)
                    .then(user => {
                    console.log(req.query.loja);
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
    }
    envelope(document) {
        let resource = super.envelope(document);
        const restId = document.loja._id ? document.loja._id : document.loja;
        resource._links.loja = `/lojas/${restId}`;
        return resource;
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, [this.findByLoja, this.findAll]);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, [authz_handler_1.authorize('admin'), this.save]);
    }
}
exports.categoriasRouter = new CategoriasRouter();
