import express from "express";
import { VerifyJWToken } from '../utils'

export default (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {

    if(req.path === '/user/login' || req.path === '/sign-up' || req.path === '/'){
        return next();
    }

    const token = req.headers.token;

    VerifyJWToken(String(token)).then(user => {
        // @ts-ignore
        req.user = user.data._doc;
        next()
    }).catch(() => {
        res.status(403).json({message: 'Invalid auth token'})
    })

}