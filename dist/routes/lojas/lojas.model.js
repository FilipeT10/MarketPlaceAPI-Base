"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loja = void 0;
const imagens_model_1 = require("./../models/imagens.model");
const mongoose = require("mongoose");
const aplications_model_1 = require("../aplications/aplications.model");
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
        required: true
    },
    ativo: {
        type: Boolean,
        required: false,
        default: true
    },
    logo: {
        type: imagens_model_1.ImagensSchema,
        required: false
    }
});
exports.Loja = mongoose.model('Loja', lojaSchema);
