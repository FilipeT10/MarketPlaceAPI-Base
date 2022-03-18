"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const restify_errors_1 = require("restify-errors");
const authorize = (...profiles) => {
    console.log('Entrou Authororize');
    return (req, resp, next) => {
        if (req.authenticated !== undefined && req.authenticated.hasAny(...profiles)) {
            return next();
        }
        else {
            return next(new restify_errors_1.ForbiddenError('Permission denied'));
        }
    };
};
exports.authorize = authorize;
