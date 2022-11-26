import {ApiError} from "../core/apiErrors";
import express from "express";

export const errorMiddleware = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(err instanceof ApiError){
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }

    return res.status(500).json({message: 'Servers error'})
}