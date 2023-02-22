import * as mongoose from 'mongoose'

export interface Cores extends mongoose.Document{
    primary: string,
    primaryLight: string,
    secondary: string,
    secondaryLight: string
}


const coresSchema = new mongoose.Schema({
    primary: {
        type: String,
        required: true,
        maxlength: 10
    },
    primaryLight: {
        type: String,
        required: true,
        maxlength: 10
    },
    secondary: {
        type: String,
        required: true,
        maxlength: 10
    },
    secondaryLight: {
        type: String,
        required: true,
        maxlength: 10
    }
}, { _id : false })




export const CoresSchema = coresSchema

export const Cores = mongoose.model<Cores>('Cores', coresSchema)


