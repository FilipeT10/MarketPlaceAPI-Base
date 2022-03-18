"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const handleError = (req, resp, err, done) => {
    switch (err.name) {
        case 'MongoError':
            if (err.code === 11000) {
                err.statusCode = 400;
            }
            err.toJSON = () => {
                return {
                    message: err.message
                };
            };
            break;
        case 'ValidationError':
            err.statusCode = 400;
            break;
    }
    done();
    /*
    if(!err.message){
        err.toJSON = () =>{
            return{
                message: err.message
            }
        }
    }else{
        err = {
            name: err.name,
            message: err.message
        }
    }



    switch(err.name){
        case 'MongoError':
            if(err.code === 11000){
                err.statusCode = 400
            }
            break
        case 'ValidationError':
            console.warn(err.name)
            err.statusCode = 400
            break
    }*/
};
exports.handleError = handleError;
