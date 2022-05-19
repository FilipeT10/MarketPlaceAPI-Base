"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AplicationsSchema = exports.Aplication = void 0;
const mongoose = require("mongoose");
const aplicationsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        enum: ["App", "Site"],
        required: true
    },
    ativo: {
        type: Boolean,
        required: false,
        default: true
    },
});
exports.Aplication = mongoose.model('Aplication', aplicationsSchema);
exports.AplicationsSchema = aplicationsSchema;
