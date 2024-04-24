"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loja = void 0;
const imagens_model_1 = require("./../models/imagens.model");
const mongoose = require("mongoose");
const aplications_model_1 = require("../aplications/aplications.model");
const cores_model_1 = require("../models/cores.model");
const enderecos_model_1 = require("../models/enderecos.model ");
const lojaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    aplications: {
        type: [aplications_model_1.AplicationsSchema],
        required: true,
        default: []
    },
    tipoLoja: {
        type: String,
        enum: ["alimentacao", "roupa", "variados"],
        required: true
    },
    ativo: {
        type: Boolean,
        required: false,
        default: true
    },
    valorFrete: {
        type: String,
        required: true,
    },
    endereco: {
        type: enderecos_model_1.EnderecosSchema,
        required: true,
        default: {}
    },
    cores: {
        type: cores_model_1.CoresSchema,
        required: true,
        default: []
    },
    logo: {
        type: imagens_model_1.ImagensSchema,
        required: false
    }
});
exports.Loja = mongoose.model('Loja', lojaSchema);
