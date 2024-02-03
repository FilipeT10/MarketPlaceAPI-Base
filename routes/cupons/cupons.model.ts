import { Categoria } from './../categorias/categorias.model';
import { SubCategoria } from './../subcategorias/subcategorias.model';
import * as mongoose from 'mongoose'
import {Loja} from '../lojas/lojas.model'

export interface Cupom extends mongoose.Document{
    name: string,
    descricao: string,
    periodoInicial: Date,
    periodoFinal: Date,
    loja: mongoose.Types.ObjectId | Loja,
    categorias: mongoose.Types.ObjectId[],
    valor: number,
    ativo: boolean,
    subcategorias: mongoose.Types.ObjectId[],
    condicao: string,
    valorCondicao: number,
    tipo: string,
}


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
    valor:{
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
    valorCondicao:{
        type: Number,
        required: false
    },
    tipo: {
        type: String,
        enum: ["%", "$"],
        required: true
    },
})


export interface CupomModel extends mongoose.Model<Cupom> {
    findByLoja(loja: string, categoria: string, ativo: boolean, projection?: string): Promise<Cupom>
}

cupomSchema.statics.findByLoja = function(loja: string, categoria: string,  ativo: boolean, projection: string){
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


export const Cupom = mongoose.model<Cupom, CupomModel>('Cupom', cupomSchema)


