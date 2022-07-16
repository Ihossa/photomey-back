import {UserModel} from "../schemas";
import express from "express";

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
    UserModel.findOneAndUpdate(
        {_id:'62769b116ae15b67ac3f923d'},
        {lastSeen: new Date()},
        {new: true},
        () => {}
    );
    next();

}