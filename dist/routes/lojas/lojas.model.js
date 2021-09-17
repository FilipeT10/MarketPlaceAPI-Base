"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loja = void 0;
const mongoose = require("mongoose");
const aplicationsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        enum: ["App", "Site"],
        required: true
    },
    ativo: {
        type: Boolean,
        required: false,
        default: true
    }
});
const lojaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    apiName: {
        type: String,
        required: true
    },
    aplications: {
        type: [aplicationsSchema],
        required: false,
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
    }
});
exports.Loja = mongoose.model('Loja', lojaSchema);
