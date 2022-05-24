import * as mongoose from 'mongoose'
import {Restaurant} from '../restaurants/restaurants.model'
import {User} from '../users/user.model'

export interface TipoPagamento extends mongoose.Document{
    name: string,
    ativo: boolean
}


const tipoPagamentoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 500
    },
    ativo: {
        type: Boolean,
        required: false,
        default: true
    }
})


export const TipoPagamentoSchema = tipoPagamentoSchema


export const TipoPagamento = mongoose.model<TipoPagamento>('TipoPagamento', tipoPagamentoSchema)


