"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationAll = exports.notification = void 0;
const user_model_1 = require("../routes/users/user.model");
const restify_errors_1 = require("restify-errors");
const axios_1 = require("axios");
const notification = (title, message, id, req, resp, next) => {
    user_model_1.User.findOne({ _id: id, loja: req.authenticated.loja })
        .then(user => {
        if (!user) {
            return next(new restify_errors_1.BadRequestError("Não foi possível enviar a notificação."));
        }
        if (!user.pushToken) {
            return next(new restify_errors_1.BadRequestError("Usuário não está preparado para receber notificações."));
        }
        let data = JSON.stringify({
            "to": user.pushToken,
            "priority": "high",
            "notification": {
                "title": title,
                "body": message,
                "text": "Text"
            }
        });
        let config = {
            maxBodyLength: Infinity,
            headers: {
                'Authorization': 'key=AAAAEMmNEq4:APA91bHdejM-1Aaf1mI_P95hOudOwH5jVAg0f48tjyh_ks-jAdSbscvv0j81A6IEG8CKhcwuglyHuCAAaFTUcH1euFci_QtufsBbLpjPVj7bu01BwG1f4JW4Ng0PxhNyAChzVxaGCGj0',
                'Content-Type': 'application/json'
            },
        };
        axios_1.default.post('https://fcm.googleapis.com/fcm/send', data, config)
            .then(function (response) {
            return resp.json(200, response.data);
        })
            .catch(function (error) {
            return next(new restify_errors_1.BadRequestError("Não foi possível enviar a notificação."));
        });
    }).catch(next);
};
exports.notification = notification;
const notificationAll = (title, message, req, resp, next) => {
    let data = JSON.stringify({
        "to": '/topics/' + req.authenticated.loja,
        "priority": "high",
        "notification": {
            "title": title,
            "body": message,
        }
    });
    let config = {
        maxBodyLength: Infinity,
        headers: {
            'Authorization': 'key=AAAAEMmNEq4:APA91bHdejM-1Aaf1mI_P95hOudOwH5jVAg0f48tjyh_ks-jAdSbscvv0j81A6IEG8CKhcwuglyHuCAAaFTUcH1euFci_QtufsBbLpjPVj7bu01BwG1f4JW4Ng0PxhNyAChzVxaGCGj0',
            'Content-Type': 'application/json'
        },
    };
    axios_1.default.post('https://fcm.googleapis.com/fcm/send', data, config)
        .then(function (response) {
        return resp.json(200, response.data);
    })
        .catch(function (error) {
        return next(new restify_errors_1.BadRequestError("Não foi possível enviar a notificação."));
    });
};
exports.notificationAll = notificationAll;
