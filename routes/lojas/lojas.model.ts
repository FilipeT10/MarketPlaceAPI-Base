import * as mongoose from 'mongoose'
import {Aplication, AplicationsSchema} from '../aplications/aplications.model'


export interface Loja extends mongoose.Document {
    name: string,
    apiName: string,
    aplications: Aplication[],
    tipoLoja: string
    ativo: boolean
}





const lojaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    apiName: {
        type: String,
        required: true
    },
    aplications: {
        type: [AplicationsSchema],
        required: false,
        default: []
    },
    tipoLoja: {
        type: String,
        required: true
    },
    ativo: {
        type: Boolean,
        required: false,
        default: true
    }
})

export const Loja = mongoose.model<Loja>('Loja', lojaSchema)


