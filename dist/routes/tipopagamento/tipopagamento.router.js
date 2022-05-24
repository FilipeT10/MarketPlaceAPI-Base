"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tipoPagamentoRouter = void 0;
const authz_handler_1 = require("./../../security/authz.handler");
const model_router_1 = require("../../common/model-router");
const tipopagamento_model_1 = require("./tipopagamento.model");
class TipoPagamentosRouter extends model_router_1.ModelRouter {
    constructor() {
        super(tipopagamento_model_1.TipoPagamento);
        this.findById = (req, resp, next) => {
            this.model.findById(req.params.id)
                .then(this.render(resp, next))
                .catch(next);
        };
    }
    envelope(document) {
        let resource = super.envelope(document);
        return resource;
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, [(0, authz_handler_1.authorize)('sysAdminMktPlc'), this.save]);
        application.patch(`${this.basePath}/:id`, [this.validateId, (0, authz_handler_1.authorize)('sysAdminMktPlc'), this.update]);
    }
}
exports.tipoPagamentoRouter = new TipoPagamentosRouter();
