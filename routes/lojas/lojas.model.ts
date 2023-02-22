import { Imagem, ImagensSchema } from './../models/imagens.model';
import * as mongoose from 'mongoose'
import {Aplication, AplicationsSchema} from '../aplications/aplications.model'
import { Cores, CoresSchema } from '../models/cores.model';
import { Endereco, EnderecosSchema } from '../models/enderecos.model ';

export interface Loja extends mongoose.Document {
    name: string,
    apiName: string,
    aplications: Aplication[],
    tipoLoja: string
    ativo: boolean
    endereco: Endereco,
    cores: Cores
    logo: Imagem,
}



const lojaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    aplications: {
        type: [AplicationsSchema],
        required: true,
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
    },
    endereco: {
        type: EnderecosSchema,
        required: true,
        default: {}
    },
    cores: {
        type: CoresSchema,
        required: true,
        default: []
    },
    logo: {
        type: ImagensSchema,
        required: false
    }
})

export const Loja = mongoose.model<Loja>('Loja', lojaSchema)


