"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoria = exports.SubCategoriaSchema = void 0;
const mongoose = require("mongoose");
const subcategoriaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 30
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
    ativo: {
        type: Boolean,
        required: false,
        default: true
    }
});
subcategoriaSchema.statics.findByLoja = function (loja, ativo, projection) {
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
exports.SubCategoriaSchema = subcategoriaSchema;
exports.SubCategoria = mongoose.model('SubCategoria', subcategoriaSchema);
