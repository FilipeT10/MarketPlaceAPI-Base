import { Categoria } from './../categorias/categorias.model';
import { SubCategoria, SubCategoriaSchema } from './../subcategorias/subcategorias.model';
import * as mongoose from 'mongoose'
import {Loja} from '../lojas/lojas.model'
import {User} from '../users/user.model'

import {Imagem, ImagensSchema} from '../models/imagens.model'
import { Promocao, PromocaosSchema } from '../models/promocao.model';
export interface Produto extends mongoose.Document{
    name: string,
    descricao: string,
    loja: mongoose.Types.ObjectId | Loja,
    categoria: mongoose.Types.ObjectId | Categoria,
    preco: string,
    tamanhos: [string],
    cores: [string],
    promocao: Promocao, 
    ingredientes: [string],
    quantidade: number
    ativo: boolean,
    data: Date,
    imagens: Imagem[],
    subcategorias: mongoose.Types.ObjectId[] | SubCategoria[],
}


const produtoSchema = new mongoose.Schema({
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
    quantidade:{
        type: Number,
        required: true
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
        type: [ImagensSchema],
        required: true,
        default: []
    },
    promocao: {
        type: PromocaosSchema,
        required: false,
        default: null
    },
    subcategorias: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'SubCategoria',
        required: true,
        default: []
    }
})


export interface ProdutoModel extends mongoose.Model<Produto> {
    findByLoja(loja: string, categoria: string, ativo: boolean, projection?: string): Promise<Produto>
}

produtoSchema.statics.findByLoja = function(loja: string, categoria: string,  ativo: boolean, projection: string){
    /*return this.find({loja}).exec(function(err, users) {
        console.log(users)
        //res.json(users);
      })
    //*/
    if(categoria == undefined){
        if(ativo != undefined){
            return this.find({loja, ativo}, projection)
        }else{
            return this.find({loja}, projection)
        }
    }else{
        if(ativo != undefined){
            return this.find({loja, categoria, ativo}, projection)
        }else{
            return this.find({loja, categoria}, projection)
        }
    }
}


export const Produto = mongoose.model<Produto, ProdutoModel>('Produto', produtoSchema)


