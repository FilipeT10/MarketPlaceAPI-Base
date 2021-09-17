import * as mongoose from 'mongoose'
import {Loja} from '../lojas/lojas.model'
import {User} from '../users/user.model'

export interface Categoria extends mongoose.Document{
    name: number,
    loja: mongoose.Types.ObjectId | Loja,
    ativo: boolean
}

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
})
export interface CategoriaModel extends mongoose.Model<Categoria> {
    findByLoja(loja: string, projection?: string): Promise<Categoria>
}

categoriaSchema.statics.findByLoja = function(loja: string, projection: string){

    return this.findOne({loja}, projection)// {email: email}
}


export const Categoria = mongoose.model<Categoria, CategoriaModel>('Categoria', categoriaSchema)


