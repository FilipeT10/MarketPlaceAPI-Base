import { ProdutoPedido, ProdutoPedidoSchema } from './../models/produtopedido.model'
import { Pedido, PedidoSchema } from './../pedidos/pedidos.model'
import { Produto } from './../produtos/produtos.model'
import * as mongoose from 'mongoose'
import {validateCPF} from '../../common/validator'
import * as bcrypt from 'bcrypt'
import {environment} from '../../common/environment'
import {Loja} from '../lojas/lojas.model'
import { Endereco, EnderecosSchema } from '../models/enderecos.model '

export interface User extends mongoose.Document {
    name: string,
    email: string,
    password: string,
    cpf: string,
    gender: string,
    pushToken: string,
    telefone: string,
    data: Date,
    pontos: number,
    loja: mongoose.Types.ObjectId | Loja,
    profiles: string[],
    enderecos: Endereco[],
    carrinho: ProdutoPedido[],
    favoritos: mongoose.Types.ObjectId[] | Produto[],
    pedidos: mongoose.Types.ObjectId[] | Pedido[],
    matches(password: string): boolean,
    hasAny(...profiles: string[]): boolean
}

export interface UserModel extends mongoose.Model<User> {
    findByEmail(email: string, projection?: string): Promise<User>
}

const userSchema = new mongoose.Schema({
    name:{ 
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    pushToken:{ 
        type: String,
        required: false,
    },
    telefone:{ 
        type: Number,
        required: true,
        maxlength: 11,
        match: /^\d{10,11}$/
    },
    email:{
        type: String,
        unique: true,
        required: true,
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    password:{
        type: String,
        select: false,
        required: true
    },
    gender: {
        type: String,
        required: false,
        enum: ["Male", "Female", ""]
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validateCPF,
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
    },
    pontos:{
        type: Number,
        required: false,
        default: 0
    },
    data: { 
        type: Date, 
        default: Date.now
    },
    loja: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loja',
    },
    enderecos: {
        type: [EnderecosSchema],
        required: true,
        default: []
    },
    profiles: {
        type: [String],
        required: true
    },
    carrinho: {
        type: [ProdutoPedidoSchema],
        required: true,
        default: []
    },
    pedidos: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Pedido',
        required: true,
        default: []
    },
    favoritos: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Produto',
        required: true,
        default: []
    }
})

userSchema.statics.findByEmail = function(email: string, projection: string){
    return this.findOne({email}, projection)// {email: email}
}

//fiz o cast no password pq tava dando erro no typescript
userSchema.methods.matches = function(password: string): boolean {
    return bcrypt.compareSync(password, this.password)
}
userSchema.methods.hasAny = function(...profiles: string[]): boolean {
    return profiles.some(profile => this.profiles.indexOf(profile)!== -1)
}

const hashPassword = (obj, next) =>{
    bcrypt.hash(obj.password, environment.security.saltRounds)
    .then(hash => {
        obj.password = hash
        next()
        
    }).catch(next)
}

const saveMiddleware = function(next){
    const user: User = this

    if(!user.isModified('password')){
        next()
    }else{
        hashPassword(user, next)
    }
}
const updateMiddleware = function(next){

    if(!this.getUpdate().password){
        next()
    }else{
        
        hashPassword(this.getUpdate(), next)
    }
}

userSchema.pre('save', saveMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)
userSchema.pre('update', updateMiddleware)

export const User = mongoose.model<User, UserModel>('User', userSchema)
