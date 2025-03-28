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
exports.pedidosRouter = void 0;
const model_router_1 = require("../../common/model-router");
const pedidos_model_1 = require("./pedidos.model");
const restify_errors_1 = require("restify-errors");
const authz_handler_1 = require("../../security/authz.handler");
const user_model_1 = require("../users/user.model");
const produtos_model_1 = require("../produtos/produtos.model");
const notifications_handler_1 = require("../../functions/notifications.handler");
class PedidosRouter extends model_router_1.ModelRouter {
    constructor() {
        super(pedidos_model_1.Pedido);
        this.findById = (req, resp, next) => {
            this.model.findById(req.params.id)
                .then(this.render(resp, next))
                .catch(next);
        };
        this.compareStatus = (novoStatus, id, next) => __awaiter(this, void 0, void 0, function* () {
            var status = yield this.model.findById(id)
                .then((pedido) => {
                if (pedido.status < novoStatus) {
                    return true;
                }
                else {
                    return false;
                }
            })
                .catch(() => { return false; });
            return status;
        });
        this.clearCart = (req, resp, next) => {
            const options = { runValidators: true, new: true };
            user_model_1.User.findByIdAndUpdate(req.body.user, { carrinho: [] }, options)
                .then(() => { this.save(req, resp, next); })
                .catch(next);
        };
        this.aprovarPedido = (req, resp, next) => __awaiter(this, void 0, void 0, function* () {
            const options = { runValidators: true, new: true };
            var status = 2;
            var pagamentoPresencial = true;
            if (pagamentoPresencial) {
                status = 3;
            }
            var compare = yield this.compareStatus(status, req.params.id, next);
            if (compare) {
                this.model.findByIdAndUpdate(req.params.id, { status: status }, options)
                    .then((pedido) => {
                    resp.json(200, pedido);
                    resp.end();
                    (0, notifications_handler_1.notification)("Pedido aprovado!", "O seu pedido " + pedido.numeroPedido + " foi aprovado.", String(pedido.user), req, resp, next);
                }).catch(next);
            }
            else {
                next(new restify_errors_1.NotFoundError('Invalid status'));
            }
        });
        this.setarPagoPedido = (req, resp, next) => __awaiter(this, void 0, void 0, function* () {
            const options = { runValidators: true, new: true };
            var status = 3;
            var compare = yield this.compareStatus(status, req.params.id, next);
            if (compare) {
                this.model.findByIdAndUpdate(req.params.id, { status: status }, options)
                    .then((pedido) => {
                    resp.json(200, pedido);
                    resp.end();
                    (0, notifications_handler_1.notification)("Pagamento efetuado!", "O pagamento do seu pedido " + pedido.numeroPedido + " foi efetuado.", String(pedido.user), req, resp, next);
                }).catch(next);
            }
            else {
                next(new restify_errors_1.NotFoundError('Invalid status'));
            }
        });
        this.setarEntregaPedido = (req, resp, next) => __awaiter(this, void 0, void 0, function* () {
            const options = { runValidators: true, new: true };
            var status = 4;
            var compare = yield this.compareStatus(status, req.params.id, next);
            if (compare) {
                this.model.findByIdAndUpdate(req.params.id, { status: status }, options)
                    .then((pedido) => {
                    resp.json(200, pedido);
                    resp.end();
                    (0, notifications_handler_1.notification)("Pedido a caminho!", "O seu pedido " + pedido.numeroPedido + " está em processo de entrega.", String(pedido.user), req, resp, next);
                }).catch(next);
            }
            else {
                next(new restify_errors_1.NotFoundError('Invalid status'));
            }
        });
        this.setarFinalizarPedido = (req, resp, next) => __awaiter(this, void 0, void 0, function* () {
            const options = { runValidators: true, new: true };
            var status = 5;
            var compare = yield this.compareStatus(status, req.params.id, next);
            if (compare) {
                this.model.findByIdAndUpdate(req.params.id, { status: status }, options)
                    .then((pedido) => {
                    resp.json(200, pedido);
                    resp.end();
                    (0, notifications_handler_1.notification)("Pedido finalizado!", "O seu pedido " + pedido.numeroPedido + " foi finalizado.", String(pedido.user), req, resp, next);
                }).catch(next);
            }
            else {
                next(new restify_errors_1.NotFoundError('Invalid status'));
            }
        });
        this.cancelarPedido = (req, resp, next) => __awaiter(this, void 0, void 0, function* () {
            const options = { runValidators: true, new: true };
            var status = 6;
            var compare = yield this.compareStatus(status, req.params.id, next);
            if (compare) {
                this.model.findByIdAndUpdate(req.params.id, { status: status }, options)
                    .then((pedido) => {
                    resp.json(200, pedido);
                    resp.end();
                    (0, notifications_handler_1.notification)("Pedido cancelado!", "O seu pedido " + pedido.numeroPedido + " foi cancelado.", String(pedido.user), req, resp, next);
                }).catch(next);
            }
            else {
                next(new restify_errors_1.NotFoundError('Invalid status'));
            }
        });
        this.consultarSubtotal = (req, resp, next) => __awaiter(this, void 0, void 0, function* () {
            if (!req.params.loja) {
                return next(new restify_errors_1.BadRequestError('Loja inválida!'));
            }
            let products = req.body;
            if (products == undefined || products.length < 1) {
                return next(new restify_errors_1.BadRequestError('Produtos inválidos!'));
            }
            let valorTotal = 0;
            try {
                yield Promise.all(products.map((id) => __awaiter(this, void 0, void 0, function* () {
                    var item = yield produtos_model_1.Produto.findOne({ _id: id });
                    valorTotal += Number(item.promocao ? item.promocao.preco : item.preco);
                })));
                resp.json({ valorTotal });
                resp.end();
            }
            catch (e) {
                return next(new restify_errors_1.BadRequestError('Erro ao calcular o valor.'));
            }
        });
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
        application.post(`${this.basePath}`, [this.clearCart]);
        application.post(`${this.basePath}/:id/aprovar`, [this.validateId, (0, authz_handler_1.authorize)('admin'), this.aprovarPedido]);
        application.post(`${this.basePath}/:id/pago`, [this.validateId, (0, authz_handler_1.authorize)('admin'), this.setarPagoPedido]);
        application.post(`${this.basePath}/:id/entrega`, [this.validateId, (0, authz_handler_1.authorize)('admin'), this.setarEntregaPedido]);
        application.post(`${this.basePath}/:id/finalizar`, [this.validateId, (0, authz_handler_1.authorize)('admin'), this.setarFinalizarPedido]);
        application.post(`${this.basePath}/:id/cancelar`, [this.validateId, this.cancelarPedido]);
        application.patch(`${this.basePath}/:id`, [this.validateId, (0, authz_handler_1.authorize)('admin'), this.update]);
        application.post(`${this.basePath}/subtotal/:loja`, [this.consultarSubtotal]);
    }
}
exports.pedidosRouter = new PedidosRouter();
