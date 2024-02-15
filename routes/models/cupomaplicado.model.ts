import * as mongoose from 'mongoose'

export interface CupomAplicado extends mongoose.Document{
    name: string,
    valorCorrigido: Number,
    valorDesconto: Number,
    valorTotal: Number
}


const cupomAplicadoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 40
    },
    valorCorrigido: {
        type: Number,
        required: true,
    },
    valorDesconto: {
        type: Number,
        required: true,
    },
    valorTotal: {
        type: Number,
        required: true,
    }
}, { _id : false })




export const CupomAplicadoSchema = cupomAplicadoSchema

export const CupomAplicado = mongoose.model<CupomAplicado>('CupomAplicado', cupomAplicadoSchema)


