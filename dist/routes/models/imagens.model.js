"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagensSchema = exports.Imagem = void 0;
const mongoose = require("mongoose");
const imagensSchema = new mongoose.Schema({
    base: {
        type: String,
        required: true
    }
}, { _id: false });
exports.Imagem = mongoose.model('Imagem', imagensSchema);
exports.ImagensSchema = imagensSchema;
