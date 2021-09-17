"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categoria = void 0;
const mongoose = require("mongoose");
const categoriaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    loja: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loja',
        required: true
    },
    ativo: {
        type: Boolean,
        required: false,
        default: true
    }
});
categoriaSchema.statics.findByLoja = function (loja, ativo, projection) {
    /*return this.find({loja}).exec(function(err, users) {
        console.log(users)
        //res.json(users);
      })
    //*/
    if (ativo != undefined) {
        return this.find({ loja, ativo }, projection);
    }
    else {
        return this.find({ loja }, projection);
    }
};
exports.Categoria = mongoose.model('Categoria', categoriaSchema);
