import * as mongoose from 'mongoose'

export interface AplicationsItem extends mongoose.Document{
    name: string,
    tipo: string
    ativo: boolean
}

export interface Loja extends mongoose.Document {
    name: string,
    apiName: string,
    aplications: AplicationsItem[],
    tipoLoja: string
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
    }
})

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
        type: [aplicationsSchema],
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


