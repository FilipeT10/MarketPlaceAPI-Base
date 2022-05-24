import { Produto } from './../produtos/produtos.model';
import * as mongoose from 'mongoose'

export interface ProdutoPedido extends mongoose.Document{
    name: string,
    preco: string,
    tamanho: string,
    cor: string,
    ingredientes: [string],
    quantidade: number
    produto: mongoose.Types.ObjectId | Produto,
}


const produtoPedidoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 40
    },
    produto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto',
        required: true
    },
    preco: {
        type: String,
        required: true,
        maxlength: 20
    },
    tamanho: {
        type: String,
        required: false,
        maxlength: 20
    },
    cor: {
        type: String,
        required: false,
        maxlength: 20
    },
    ingredientes: {
        type: [String],
        required: false,
        maxlength: 20
    },
    quantidade:{
        type: Number,
        required: true
    }
})




export const ProdutoPedidoSchema = produtoPedidoSchema

export const ProdutoPedido = mongoose.model<ProdutoPedido>('ProdutoPedido', produtoPedidoSchema)


