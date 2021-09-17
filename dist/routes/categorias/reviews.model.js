"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categoria = void 0;
const mongoose = require("mongoose");
const categoriaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        maxlength: 20
    },
    categoriaPai: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: false
    },
    loja: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loja',
        required: true
    }
});
exports.Categoria = mongoose.model('Categoria', categoriaSchema);
