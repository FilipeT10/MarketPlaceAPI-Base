import * as mongoose from 'mongoose'
import {Loja} from '../lojas/lojas.model'

export interface Aplication extends mongoose.Document{
    name: string,
    tipo: string
    ativo: boolean
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
})


export const Aplication = mongoose.model<Aplication>('Aplication', aplicationsSchema)

export const AplicationsSchema = aplicationsSchema


