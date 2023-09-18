import * as mongoose from 'mongoose'

export interface Promocao extends mongoose.Document{
    periodoInicial: Date
    periodoFinal: Date
    descricao: string,
    preco: string,
}

const promocaosSchema = new mongoose.Schema({
    periodoInicial: {
        type: Date,
        required: true
    },
    periodoFinal: {
        type: Date,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    preco: {
        type: String,
        required: true
    },
});

export const Promocao = mongoose.model<Promocao>('Promocao', promocaosSchema)

export const PromocaosSchema = promocaosSchema


