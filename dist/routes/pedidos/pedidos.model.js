"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pedido = exports.PedidoSchema = void 0;
const mongoose = require("mongoose");
const enderecos_model_1 = require("../models/enderecos.model ");
const pedidoSchema = new mongoose.Schema({
    loja: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loja',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tipoPagamento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoPagamento',
        required: true
    },
    valor: {
        type: String,
        required: true,
        maxlength: 20
    },
    status: {
        type: String,
        required: true,
        maxlength: 25
    },
    pontos: {
        type: Number,
        required: true
    },
    data: {
        type: Date,
        default: Date.now
    },
    endereco: {
        type: enderecos_model_1.EnderecosSchema,
        required: true
    },
});
pedidoSchema.statics.findByLoja = function (loja, user, ativo, projection) {
    /*return this.find({loja}).exec(function(err, users) {
        console.log(users)
        //res.json(users);
      })
    //*/
    if (user == undefined) {
        if (ativo != undefined) {
            return this.find({ loja, ativo }, projection);
        }
        else {
            return this.find({ loja }, projection);
        }
    }
    else {
        if (ativo != undefined) {
            return this.find({ loja, user, ativo }, projection);
        }
        else {
            return this.find({ loja, user }, projection);
        }
    }
};
exports.PedidoSchema = pedidoSchema;
exports.Pedido = mongoose.model('Pedido', pedidoSchema);
