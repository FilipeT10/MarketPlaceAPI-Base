"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const produtopedido_model_1 = require("./../models/produtopedido.model");
const mongoose = require("mongoose");
const validator_1 = require("../../common/validator");
const bcrypt = require("bcrypt");
const environment_1 = require("../../common/environment");
const enderecos_model_1 = require("../models/enderecos.model ");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    pushToken: {
        type: String,
        required: false,
    },
    telefone: {
        type: String,
        required: true,
        maxlength: 12,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    password: {
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
            validator: validator_1.validateCPF,
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
    },
    pontos: {
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
        type: [enderecos_model_1.EnderecosSchema],
        required: true,
        default: []
    },
    profiles: {
        type: [String],
        required: true
    },
    carrinho: {
        type: [produtopedido_model_1.ProdutoPedidoSchema],
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
});
userSchema.statics.findByEmail = function (email, projection) {
    return this.findOne({ email }, projection); // {email: email}
};
//fiz o cast no password pq tava dando erro no typescript
userSchema.methods.matches = function (password) {
    return bcrypt.compareSync(password, this.password);
};
userSchema.methods.hasAny = function (...profiles) {
    return profiles.some(profile => this.profiles.indexOf(profile) !== -1);
};
const hashPassword = (obj, next) => {
    bcrypt.hash(obj.password, environment_1.environment.security.saltRounds)
        .then(hash => {
        obj.password = hash;
        next();
    }).catch(next);
};
const saveMiddleware = function (next) {
    const user = this;
    if (!user.isModified('password')) {
        next();
    }
    else {
        hashPassword(user, next);
    }
};
const updateMiddleware = function (next) {
    if (!this.getUpdate().password) {
        next();
    }
    else {
        hashPassword(this.getUpdate(), next);
    }
};
userSchema.pre('save', saveMiddleware);
userSchema.pre('findOneAndUpdate', updateMiddleware);
userSchema.pre('update', updateMiddleware);
exports.User = mongoose.model('User', userSchema);
