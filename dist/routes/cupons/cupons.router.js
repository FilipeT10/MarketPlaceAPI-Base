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
const produtos_model_1 = require("../produtos/produtos.model");
const pedidos_model_1 = require("../pedidos/pedidos.model");
const notifications_handler_1 = require("../../functions/notifications.handler");
const formatter_1 = require("../../common/formatter");
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
                return next(new restify_errors_1.BadRequestError('Período final inválido!'));
            }
            const tempoRestante = new Date(req.body.periodoFinal) - new Date();
            //20 dias
            if (tempoRestante > 1728000000) {
                return next(new restify_errors_1.BadRequestError('O intervalo máximo permitido é de 20 dias.'));
            }
            var valid = yield this.validaCupom(req.body.name);
            if (!valid) {
                return next(new restify_errors_1.ConflictError('Já possui um cupom cadastrado com esse nome.'));
            }
            let document = new this.model(req.body);
            this.model.create(document)
                .then((doc) => {
                setTimeout(() => this.desativarCupom(req.params.id, req.body.periodoFinal), tempoRestante);
                resp.json(doc);
                resp.end();
                if (document.ativo) {
                    (0, notifications_handler_1.notificationAll)("Cupom " + document.name, document.descricao + "\nDisponível entre: " + (0, formatter_1.dateFormat)(new Date(document.periodoInicial)) + " a " + (0, formatter_1.dateFormat)(new Date(document.periodoFinal)), req, resp, next);
                }
            })
                .catch(next);
        });
        this.consultarCupom = (req, resp, next) => __awaiter(this, void 0, void 0, function* () {
            if (!req.params.loja) {
                return next(new restify_errors_1.BadRequestError('Loja inválida!'));
            }
            if (!req.params.name) {
                return next(new restify_errors_1.BadRequestError('Cupom inválido!'));
            }
            var cupom = yield this.model.findOne({ name: req.params.name, loja: req.params.loja });
            if (!cupom) {
                return next(new restify_errors_1.ConflictError('Não possui nenhum cupom cadastrado com esse nome.'));
            }
            if (!cupom.ativo) {
                return next(new restify_errors_1.ConflictError('Cupom expirado ou inativo.'));
            }
            let products = req.body;
            if (products == undefined || products.length < 1) {
                return next(new restify_errors_1.BadRequestError('Produtos inválidos!'));
            }
            let valorTotal = 0;
            let valorCorrigido = 0;
            let valorDesconto = 0;
            try {
                yield Promise.all(products.map((id) => __awaiter(this, void 0, void 0, function* () {
                    var item = yield produtos_model_1.Produto.findOne({ _id: id });
                    valorTotal += Number(item.promocao ? item.promocao.preco : item.preco);
                })));
                yield Promise.all(products.map((id) => __awaiter(this, void 0, void 0, function* () {
                    var item = yield produtos_model_1.Produto.findOne({ _id: id });
                    if (!item) {
                        return next(new restify_errors_1.BadRequestError('Não foi possível encontrar o produto!'));
                    }
                    if (item.loja != req.params.loja) {
                        return next(new restify_errors_1.BadRequestError('Não foi possível encontrar o produto na loja!'));
                    }
                    var valorDescontoCupom = 0;
                    if (cupom.condicao == 'all' || cupom.categorias.includes(item.categoria) || cupom.subcategorias.some(id => item.subcategorias.includes(id))) {
                        var pedidoList = yield pedidos_model_1.Pedido.find({ loja: req.params.loja, user: req.authenticated._id });
                        if ((cupom.condicao == 'PC' && pedidoList.length < 1) || (cupom.condicao == ">" && cupom.valorCondicao && valorTotal >= cupom.valorCondicao) || cupom.condicao == 'all') {
                            if (cupom.tipo == "$") {
                                valorDescontoCupom = Number(cupom.valor);
                            }
                            else if (cupom.tipo == "%") {
                                let valorOriginal = Number(item.promocao ? item.promocao.preco : item.preco);
                                let porcentagemParaSubtrair = cupom.valor;
                                let porcentagemDecimal = porcentagemParaSubtrair / 100;
                                let valorDaPorcentagem = valorOriginal * porcentagemDecimal;
                                valorDescontoCupom = Number(valorDaPorcentagem);
                            }
                        }
                    }
                    let descontoItem = Number(item.promocao ? item.promocao.preco : item.preco) - valorDescontoCupom;
                    valorDesconto += valorDescontoCupom;
                    valorCorrigido += descontoItem;
                    console.log(item.name, descontoItem, valorDesconto, valorDescontoCupom);
                })));
                console.log({ valorCorrigido: valorCorrigido, valorDesconto, valorTotal });
                resp.json({ valorCorrigido: valorCorrigido, valorDesconto, valorTotal });
                resp.end();
            }
            catch (e) {
                return next(new restify_errors_1.ConflictError('Erro ao calcular a aplicação do cupom.'));
            }
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
        application.post(`${this.basePath}/consulta/:loja/:name`, [this.consultarCupom]);
    }
}
exports.cuponsRouter = new CuponsRouter();
