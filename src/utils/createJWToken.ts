import jwt from 'jsonwebtoken'
import { reduce } from "lodash";
import {IUserSchema} from '../schemas/User'

interface ILogin{
    email: string,
    password: string
}

export default (user: ILogin) => {

    let token = jwt.sign({
        data: reduce(user, (result: any, value, key)=> {
            if(key !== "password"){
                result[key] = value;
            }
            return result
        }, {})
    },
    process.env.JWT_SECRET || '', {
        expiresIn: process.env.JWT_MAX_AGE,
        algorithm: 'HS256'
    })
    return token
}