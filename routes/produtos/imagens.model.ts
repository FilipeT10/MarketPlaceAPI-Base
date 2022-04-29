import * as mongoose from 'mongoose'
import {Loja} from '../lojas/lojas.model'

export interface Imagem extends mongoose.Document{
    base: String,
    contentType: string
}

const imagensSchema = new mongoose.Schema({
    base: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
}, { _id : false });


export const Imagem = mongoose.model<Imagem>('Imagem', imagensSchema)

export const ImagensSchema = imagensSchema


