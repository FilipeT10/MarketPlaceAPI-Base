"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Produto = void 0;
const mongoose = require("mongoose");
const imagens_model_1 = require("./imagens.model");
const produtoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 40
    },
    loja: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loja',
        required: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    preco: {
        type: String,
        required: true,
        maxlength: 20
    },
    tamanhos: {
        type: [String],
        required: true,
        maxlength: 20
    },
    cores: {
        type: [String],
        required: true,
        maxlength: 20
    },
    ingredientes: {
        type: [String],
        required: true,
        maxlength: 20
    },
    tipo: {
        type: String,
        required: true,
        maxlength: 20
    },
    quantidade: {
        type: Number,
        required: false
    },
    ativo: {
        type: Boolean,
        required: false,
        default: true
    },
    data: {
        type: Date,
        default: Date.now
    },
    imagens: {
        type: [imagens_model_1.ImagensSchema],
        required: true,
        default: []
    },
});
produtoSchema.statics.findByLoja = function (loja, categoria, ativo, projection) {
    /*return this.find({loja}).exec(function(err, users) {
        console.log(users)
        //res.json(users);
      })
    //*/
    if (categoria == undefined) {
        if (ativo != undefined) {
            return this.find({ loja, ativo }, projection);
        }
        else {
            return this.find({ loja }, projection);
        }
    }
    else {
        if (ativo != undefined) {
            return this.find({ loja, categoria, ativo }, projection);
        }
        else {
            return this.find({ loja, categoria }, projection);
        }
    }
};
exports.Produto = mongoose.model('Produto', produtoSchema);
