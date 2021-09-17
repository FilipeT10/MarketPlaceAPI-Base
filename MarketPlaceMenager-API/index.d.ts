import {User} from './routes/users/user.model'

declare module 'restify' {
    export interface Request {
        authenticated: User
    }
}