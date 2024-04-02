import * as restify from 'restify'
import {User} from '../routes/users/user.model'
import { BadRequestError } from 'restify-errors';
import axios from 'axios';


export const notification = (title: string, message: string, req: restify.Request, resp: restify.Response, next: restify.Next) =>{

    User.findOne({ _id: req.params.id })
    .then(user=>{
        if (!user.pushToken) {
            return next(new BadRequestError("Usuário não está preparado para receber notificações."))
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
        }
        axios.post('https://fcm.googleapis.com/fcm/send', data, config)
        .then(function (response) {
            return resp.json(200, response.data)
        })
        .catch(function (error) {
            return next(new BadRequestError("Não foi possível enviar a notificação."))
        });
        
    }).catch(next)
}