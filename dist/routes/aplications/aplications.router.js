"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aplicationsRouter = void 0;
const model_router_1 = require("../../common/model-router");
const aplications_model_1 = require("./aplications.model");
class AplicationsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(aplications_model_1.Aplication);
        this.findById = (req, resp, next) => {
            this.model.findById(req.params.id)
                .populate('loja', 'name')
                .then(this.render(resp, next))
                .catch(next);
        };
    }
    envelope(document) {
        let resource = super.envelope(document);
        const restId = document.loja._id ? document.loja._id : document.loja;
        resource._links.loja = `/lojas/${restId}`;
        return resource;
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
    }
}
exports.aplicationsRouter = new AplicationsRouter();
