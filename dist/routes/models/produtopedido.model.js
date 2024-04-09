"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoPedido = exports.ProdutoPedidoSchema = void 0;
const mongoose = require("mongoose");
const promocao_model_1 = require("./promocao.model");
const produtoPedidoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 40
    },
    produto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto',
        required: true
    },
    preco: {
        type: String,
        required: true,
        maxlength: 20
    },
    tamanho: {
        type: String,
        required: false,
        maxlength: 20
    },
    promocao: {
        type: promocao_model_1.PromocaosSchema,
        required: false,
    },
    cor: {
        type: String,
        required: false,
        maxlength: 20
    },
    ingredientes: {
        type: [String],
        required: false,
        maxlength: 20
    },
    quantidade: {
        type: Number,
        required: true
    }
});
exports.ProdutoPedidoSchema = produtoPedidoSchema;
exports.ProdutoPedido = mongoose.model('ProdutoPedido', produtoPedidoSchema);
