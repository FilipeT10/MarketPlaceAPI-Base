import { ProdutoPedido, ProdutoPedidoSchema } from './../models/produtopedido.model';
import { TipoPagamento } from './../tipopagamento/tipopagamento.model';
import { SubCategoria, SubCategoriaSchema } from './../subcategorias/subcategorias.model';
import * as mongoose from 'mongoose'
import {Loja} from '../lojas/lojas.model'
import {User} from '../users/user.model'
import {Imagem, ImagensSchema} from '../models/imagens.model'

import {Endereco, EnderecosSchema} from '../models/enderecos.model '
export interface Pedido extends mongoose.Document{
    loja: mongoose.Types.ObjectId | Loja,
    user: mongoose.Types.ObjectId | User,
    tipoPagamento: mongoose.Types.ObjectId | TipoPagamento,
    valor: string,
    status: string,
    pontos: number,
    data: Date,
    endereco: Endereco,
    produtos: ProdutoPedido[]
}


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
    pontos:{
        type: Number,
        required: true
    },
    data: { 
        type: Date, 
        default: Date.now
    },
    endereco: {
        type: EnderecosSchema,
        required: true,
        default: {}
    },
    produtos: {
        type: [ProdutoPedidoSchema],
        required: true,
        default: []
    },
})


export interface PedidoModel extends mongoose.Model<Pedido> {
    findByLoja(loja: string, categoria: string, ativo: boolean, projection?: string): Promise<Pedido>
}

pedidoSchema.statics.findByLoja = function(loja: string, user: string,  ativo: boolean, projection: string){
    /*return this.find({loja}).exec(function(err, users) {
        console.log(users)
        //res.json(users);
      })
    //*/
    if(user == undefined){
        if(ativo != undefined){
            return this.find({loja, ativo}, projection)
        }else{
            return this.find({loja}, projection)
        }
    }else{
        if(ativo != undefined){
            return this.find({loja, user, ativo}, projection)
        }else{
            return this.find({loja, user}, projection)
        }
    }
}


export const PedidoSchema = pedidoSchema

export const Pedido = mongoose.model<Pedido, PedidoModel>('Pedido', pedidoSchema)


