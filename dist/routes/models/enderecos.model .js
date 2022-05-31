"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnderecosSchema = exports.Endereco = void 0;
const mongoose = require("mongoose");
const enderecosSchema = new mongoose.Schema({
    cep: {
        type: String,
        required: true
    },
    logradouro: {
        type: String,
        required: true
    },
    complemento: {
        type: String,
        required: true
    },
    bairro: {
        type: String,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    referencia: {
        type: String,
        required: true
    },
    numero: {
        type: Number,
        required: true
    }
}, { _id: false });
exports.Endereco = mongoose.model('Endereco', enderecosSchema);
exports.EnderecosSchema = enderecosSchema;
