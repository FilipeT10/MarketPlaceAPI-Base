"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateSGM = exports.authenticate = void 0;
const restify_errors_1 = require("restify-errors");
const user_model_1 = require("../routes/users/user.model");
const jwt = require("jsonwebtoken");
const environment_1 = require("../common/environment");
const authenticate = (req, resp, next) => {
    const { email, password } = req.body;
    user_model_1.User.findByEmail(email, '+password')
        .then(user => {
        if (user && user.matches(password)) {
            //gerar token
            const token = jwt.sign({ sub: user.email, iss: 'MarketPlace-API-Manager' }, environment_1.environment.security.apiSecret);
            resp.json({ id: user._id, name: user.name, profile: profiles[0], accessToken: token });
            return next(false);
        }
        else {
            return next(new restify_errors_1.NotAuthorizedError('Invalid Credentials'));
        }
    }).catch(next);
};
exports.authenticate = authenticate;
const authenticateSGM = (req, resp, next) => {
    const { email, password } = req.body;
    user_model_1.User.findByEmail(email, '+password')
        .then(user => {
        if (user && user.matches(password)) {
            let profiles = user.profiles;
            if (profiles[0] == "admin" || profiles[0] == "sysAdminMktPlc") {
                //gerar token
                const token = jwt.sign({ sub: user.email, iss: 'MarketPlace-API-Manager' }, environment_1.environment.security.apiSecret);
                resp.json({ id: user._id, loja: user.loja, name: user.name, profile: profiles[0], accessToken: token });
                return next(false);
            }
            else {
                next(new restify_errors_1.ForbiddenError('Permission denied'));
            }
        }
        else {
            return next(new restify_errors_1.NotAuthorizedError('Invalid Credentials'));
        }
    }).catch(next);
};
exports.authenticateSGM = authenticateSGM;
