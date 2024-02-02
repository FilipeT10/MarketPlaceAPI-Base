"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cuponsRouter = void 0;
const model_router_1 = require("../../common/model-router");
const cupons_model_1 = require("./cupons.model");
const restify_errors_1 = require("restify-errors");
const authz_handler_1 = require("../../security/authz.handler");
class CuponsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(cupons_model_1.Cupom);
        this.findById = (req, resp, next) => {
            this.model.findById(req.params.id)
                .populate('loja', 'name')
                .populate('categoria', 'name')
                .then(this.render(resp, next))
                .catch(next);
        };
        this.findByLoja = (req, resp, next) => {
            if (req.query.loja) {
                cupons_model_1.Cupom.findByLoja(req.query.loja, req.query.categoria, req.query.ativo)
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
        this.desativarCupom = (id, periodoFinal) => __awaiter(this, void 0, void 0, function* () {
            const options = { runValidators: true, new: true };
            this.model.findByIdAndUpdate(id, { ativo: false }, options)
                .then(() => {
                console.log("Cupom desativado", periodoFinal, new Date());
            }).catch(() => console.log("Não foi possível desativar o cupom", periodoFinal, new Date()));
        });
        this.validaCupom = (name) => __awaiter(this, void 0, void 0, function* () {
            var cupom = yield this.model.findOne({ name });
            if (!cupom) {
                return true;
            }
            return false;
        });
        this.aplicaCupom = (req, resp, next) => __awaiter(this, void 0, void 0, function* () {
            if (!req.params.name) {
                next(new restify_errors_1.BadRequestError('Informe o cupom!'));
            }
            if (!req.params.valor) {
                next(new restify_errors_1.BadRequestError('Informe o valor total!'));
            }
            if (!req.params.loja) {
                next(new restify_errors_1.BadRequestError('Informe a loja!'));
            }
            var cupom = yield this.model.findOne({ name: req.params.name, loja: req.params.loja });
            if (!cupom) {
                next(new restify_errors_1.ConflictError('Cupom inválido!'));
            }
            else if (new Date() > cupom.periodoFinal) {
                next(new restify_errors_1.ConflictError('Cupom expirado!'));
            }
            else if (new Date() < cupom.periodoInicial) {
                next(new restify_errors_1.ConflictError('Cupom inválido!'));
            }
            return false;
        });
        this.cadastrarCupom = (req, resp, next) => __awaiter(this, void 0, void 0, function* () {
            if (new Date(req.body.periodoFinal) <= new Date()) {
                next(new restify_errors_1.BadRequestError('Período final inválido!'));
            }
            const tempoRestante = new Date(req.body.periodoFinal) - new Date();
            //20 dias
            if (tempoRestante > 1728000000) {
                next(new restify_errors_1.BadRequestError('O intervalo máximo permitido é de 20 dias.'));
            }
            var valid = yield this.validaCupom(req.body.name);
            if (!valid) {
                next(new restify_errors_1.ConflictError('Já possui um cupom cadastrado com esse nome.'));
            }
            let document = new this.model(req.body);
            this.model.create(document)
                .then((doc) => {
                setTimeout(() => this.desativarCupom(req.params.id, req.body.periodoFinal), tempoRestante);
                resp.json(doc);
                resp.end();
            })
                .catch(next);
        });
    }
    envelope(document) {
        let resource = super.envelope(document);
        return resource;
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, [this.findByLoja, this.findAll]);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, [(0, authz_handler_1.authorize)('admin'), this.cadastrarCupom]);
        application.patch(`${this.basePath}/:id`, [this.validateId, (0, authz_handler_1.authorize)('admin'), this.update]);
    }
}
exports.cuponsRouter = new CuponsRouter();
