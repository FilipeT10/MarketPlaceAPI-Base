"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromocaosSchema = exports.Promocao = void 0;
const mongoose = require("mongoose");
const promocaosSchema = new mongoose.Schema({
    periodoInicial: {
        type: Date,
        required: true
    },
    periodoFinal: {
        type: Date,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    preco: {
        type: String,
        required: true
    },
});
exports.Promocao = mongoose.model('Promocao', promocaosSchema);
exports.PromocaosSchema = promocaosSchema;
