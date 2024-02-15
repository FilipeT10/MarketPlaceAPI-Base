"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CupomAplicado = exports.CupomAplicadoSchema = void 0;
const mongoose = require("mongoose");
const cupomAplicadoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 40
    },
    valorCorrigido: {
        type: Number,
        required: true,
    },
    valorDesconto: {
        type: Number,
        required: true,
    },
    valorTotal: {
        type: Number,
        required: true,
    }
}, { _id: false });
exports.CupomAplicadoSchema = cupomAplicadoSchema;
exports.CupomAplicado = mongoose.model('CupomAplicado', cupomAplicadoSchema);
