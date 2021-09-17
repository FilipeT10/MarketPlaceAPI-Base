import * as mongoose from 'mongoose'
import {Loja} from '../lojas/lojas.model'

export interface Aplication extends mongoose.Document{
    name: string,
    tipo: string
    ativo: boolean
    loja: mongoose.Types.ObjectId | Loja,
}

const aplicationsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        enum: ["App", "Site"],
        required: true
    },
    ativo: {
        type: Boolean,
        required: false,
        default: true
    },
    loja: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loja',
        required: true
    }
})


export const Aplication = mongoose.model<Aplication>('Aplication', aplicationsSchema)

export const AplicationsSchema = aplicationsSchema


