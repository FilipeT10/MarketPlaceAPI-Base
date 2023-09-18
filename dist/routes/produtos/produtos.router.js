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
exports.produtosRouter = void 0;
const model_router_1 = require("../../common/model-router");
const produtos_model_1 = require("./produtos.model");
const restify_errors_1 = require("restify-errors");
const authz_handler_1 = require("../../security/authz.handler");
class ProdutosRouter extends model_router_1.ModelRouter {
    constructor() {
        super(produtos_model_1.Produto);
        this.findById = (req, resp, next) => {
            this.model.findById(req.params.id)
                .populate('loja', 'name')
                .populate('categoria', 'name')
                .then(this.render(resp, next))
                .catch(next);
        };
        this.findByLoja = (req, resp, next) => {
            if (req.query.loja) {
                produtos_model_1.Produto.findByLoja(req.query.loja, req.query.categoria, req.query.ativo)
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
        this.validaPromo = (id) => __awaiter(this, void 0, void 0, function* () {
            var contemPromocao = yield this.model.findById(id)
                .then((produto) => {
                if (!produto.promocao) {
                    return true;
                }
                else {
                    return false;
                }
            })
                .catch(() => { return false; });
            return contemPromocao;
        });
        this.removerPromocaoProduto = (id, periodoFinal) => __awaiter(this, void 0, void 0, function* () {
            const options = { runValidators: true, new: true };
            var valid = yield this.validaPromo(id);
            if (!valid) {
                this.model.findByIdAndUpdate(id, { promocao: null }, options)
                    .then(() => {
                    console.log("Promoção removida do produto", periodoFinal, new Date());
                }).catch(() => console.log("Não foi possível remover promoção do produto", periodoFinal, new Date()));
            }
        });
        this.cadastrarPromocaoProduto = (req, resp, next) => __awaiter(this, void 0, void 0, function* () {
            if (new Date(req.body.periodoFinal) <= new Date()) {
                next(new restify_errors_1.NotFoundError('Período final inválido!'));
            }
            const options = { runValidators: true, new: true };
            var valid = yield this.validaPromo(req.params.id);
            if (valid) {
                this.model.findByIdAndUpdate(req.params.id, { promocao: req.body }, options)
                    .then(() => {
                    const tempoRestante = new Date(req.body.periodoFinal) - new Date();
                    setTimeout(() => this.removerPromocaoProduto(req.params.id, req.body.periodoFinal), tempoRestante);
                    next();
                }).catch(next);
            }
            else {
                next(new restify_errors_1.NotFoundError('Já possui promoção em andamento!'));
            }
        });
    }
    envelope(document) {
        let resource = super.envelope(document);
        const restId = document.loja._id ? document.loja._id : document.loja;
        resource._links.loja = `/lojas/${restId}`;
        const restCatId = document.categoria._id ? document.categoria._id : document.categoria;
        resource._links.categoria = `/categorias/${restCatId}`;
        return resource;
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, [this.findByLoja, this.findAll]);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, [(0, authz_handler_1.authorize)('admin'), this.save]);
        application.patch(`${this.basePath}/:id`, [this.validateId, (0, authz_handler_1.authorize)('admin'), this.update]);
        application.post(`${this.basePath}/:id/cadastrarPromocao`, [this.validateId, (0, authz_handler_1.authorize)('admin'), this.cadastrarPromocaoProduto, this.findById]);
    }
}
exports.produtosRouter = new ProdutosRouter();
