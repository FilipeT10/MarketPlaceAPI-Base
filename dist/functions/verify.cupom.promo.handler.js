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
exports.verifyCupomPromo = void 0;
const cupons_model_1 = require("../routes/cupons/cupons.model");
const produtos_model_1 = require("../routes/produtos/produtos.model");
const verifyCupomPromo = () => {
    cupons_model_1.Cupom.find().then(cupoms => {
        cupoms.forEach((cupom) => {
            if (cupom.ativo) {
                if (new Date(cupom.periodoFinal) <= new Date()) {
                    desativarCupom(cupom.id, cupom.periodoFinal);
                    return;
                }
                else {
                    const tempoRestante = new Date(cupom.periodoFinal) - new Date();
                    //20 dias
                    setTimeout(() => desativarCupom(cupom.id, cupom.periodoFinal), tempoRestante);
                }
            }
        });
    }).catch(() => { });
    produtos_model_1.Produto.find().then(produtos => {
        produtos.forEach((produto) => {
            if (produto.promocao) {
                if (new Date(produto.promocao.periodoFinal) <= new Date()) {
                    removerPromocaoProduto(produto.id, produto.promocao.periodoFinal);
                    return;
                }
                else {
                    const tempoRestante = new Date(produto.promocao.periodoFinal) - new Date();
                    //20 dias
                    setTimeout(() => removerPromocaoProduto(produto.id, produto.promocao.periodoFinal), tempoRestante);
                }
            }
        });
    }).catch(() => { });
};
exports.verifyCupomPromo = verifyCupomPromo;
const desativarCupom = (id, periodoFinal) => __awaiter(void 0, void 0, void 0, function* () {
    const options = { runValidators: true, new: true };
    cupons_model_1.Cupom.findByIdAndUpdate(id, { ativo: false }, options).then(() => {
        console.log("Cupom desativado", periodoFinal, new Date());
    }).catch(() => console.log("Não foi possível desativar o cupom", periodoFinal, new Date()));
});
const removerPromocaoProduto = (id, periodoFinal) => __awaiter(void 0, void 0, void 0, function* () {
    const options = { runValidators: true, new: true };
    produtos_model_1.Produto.findByIdAndUpdate(id, { promocao: null }, options).then(() => {
        console.log("Promoção removida do produto", periodoFinal, new Date());
    }).catch(() => console.log("Não foi possível remover promoção do produto", periodoFinal, new Date()));
});
