"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cupom = void 0;
const mongoose = require("mongoose");
const cupomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 40
    },
    descricao: {
        type: String,
        required: true,
        maxlength: 600
    },
    periodoInicial: {
        type: Date,
        required: true
    },
    periodoFinal: {
        type: Date,
        required: true
    },
    loja: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loja',
        required: true
    },
    categorias: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Categoria',
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    ativo: {
        type: Boolean,
        required: false,
        default: true
    },
    subcategorias: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'SubCategoria',
        required: true,
        default: []
    },
    condicao: {
        type: String,
        enum: ["PC", ">", "all"],
        required: false
    },
    valorCondicao: {
        type: Number,
        required: false
    },
    tipo: {
        type: String,
        enum: ["%", "$"],
        required: true
    },
});
cupomSchema.statics.findByLoja = function (loja, categoria, ativo, projection) {
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
exports.Cupom = mongoose.model('Cupom', cupomSchema);
