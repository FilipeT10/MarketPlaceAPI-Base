"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subcategoriasRouter = void 0;
const model_router_1 = require("../../common/model-router");
const subcategorias_model_1 = require("./subcategorias.model");
const authz_handler_1 = require("../../security/authz.handler");
class SubCategoriasRouter extends model_router_1.ModelRouter {
    constructor() {
        super(subcategorias_model_1.SubCategoria);
        this.findById = (req, resp, next) => {
            this.model.findById(req.params.id)
                .populate('loja', 'name')
                .then(this.render(resp, next))
                .catch(next);
        };
        this.findByLoja = (req, resp, next) => {
            if (req.query.loja) {
                subcategorias_model_1.SubCategoria.findByLoja(req.query.loja, req.query.ativo)
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
        return resource;
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, [this.findByLoja, this.findAll]);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, [(0, authz_handler_1.authorize)('admin'), this.save]);
        application.patch(`${this.basePath}/:id`, [this.validateId, (0, authz_handler_1.authorize)('admin'), this.update]);
    }
}
exports.subcategoriasRouter = new SubCategoriasRouter();
