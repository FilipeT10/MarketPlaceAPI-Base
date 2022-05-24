"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoPagamento = exports.TipoPagamentoSchema = void 0;
const mongoose = require("mongoose");
const tipoPagamentoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 500
    },
    ativo: {
        type: Boolean,
        required: false,
        default: true
    }
});
exports.TipoPagamentoSchema = tipoPagamentoSchema;
exports.TipoPagamento = mongoose.model('TipoPagamento', tipoPagamentoSchema);
