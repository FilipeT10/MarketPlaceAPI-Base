import * as mongoose from 'mongoose'

export interface Endereco extends mongoose.Document{
    cep: string
    logradouro: string
    numero: number
    complemento: string
    bairro: string
    cidade: string
    estado: string
    referencia: string
}

const enderecosSchema = new mongoose.Schema({
    cep: {
        type: String,
        required: true
    },
    logradouro: {
        type: String,
        required: true
    },
    complemento: {
        type: String,
        required: true
    },
    bairro: {
        type: String,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    referencia: {
        type: String,
        required: true
    },
    numero: {
        type: Number,
        required: true
    }
});

export const Endereco = mongoose.model<Endereco>('Endereco', enderecosSchema)

export const EnderecosSchema = enderecosSchema


