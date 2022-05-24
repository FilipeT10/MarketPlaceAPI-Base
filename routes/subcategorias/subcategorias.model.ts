import { Categoria } from './../categorias/categorias.model';
import * as mongoose from 'mongoose'
import {Loja} from '../lojas/lojas.model'
import {User} from '../users/user.model'

export interface SubCategoria extends mongoose.Document{
    name: number,
    loja: mongoose.Types.ObjectId | Loja,
    categoria: mongoose.Types.ObjectId | Categoria,
    ativo: boolean
}

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
})
export interface SubCategoriaModel extends mongoose.Model<SubCategoria> {
    findByLoja(loja: string, ativo: boolean, projection?: string): Promise<SubCategoria>
}

subcategoriaSchema.statics.findByLoja = function(loja: string, ativo: boolean, projection: string){
    /*return this.find({loja}).exec(function(err, users) {
        console.log(users)
        //res.json(users);
      })
    //*/
    if(ativo != undefined){
        return this.find({loja, ativo}, projection)
    }else{
        return this.find({loja}, projection)
    }
}

export const SubCategoriaSchema = subcategoriaSchema


export const SubCategoria = mongoose.model<SubCategoria, SubCategoriaModel>('SubCategoria', subcategoriaSchema)


