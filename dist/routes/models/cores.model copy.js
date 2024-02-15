"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cores = exports.CoresSchema = void 0;
const mongoose = require("mongoose");
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
}, { _id: false });
exports.CoresSchema = coresSchema;
exports.Cores = mongoose.model('Cores', coresSchema);
