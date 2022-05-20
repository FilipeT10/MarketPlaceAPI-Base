import * as mongoose from 'mongoose'
import {Loja} from '../lojas/lojas.model'

export interface Imagem extends mongoose.Document{
    base: String
}

const imagensSchema = new mongoose.Schema({
    base: {
        type: String,
        required: true
    },
}, { _id : false });


export const Imagem = mongoose.model<Imagem>('Imagem', imagensSchema)

export const ImagensSchema = imagensSchema


