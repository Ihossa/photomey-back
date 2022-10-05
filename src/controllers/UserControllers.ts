import express from "express";
import socket from 'socket.io'
import {ApiError} from "../core/apiErrors";
import {validationResult} from "express-validator";
import {userService} from "../services/userService";

export default class UserControllers {
    io: socket.Server

    constructor(io: socket.Server) {
        this.io = io
    }


    async getUsers(req:express.Request, res:express.Response, next: (e:any) => void) {
        try {
            const users = await userService.showAll();
            return res.json(users);
        } catch (e) {
            console.log(e)
            next(e);
        }
    }

    async getPerson(req:express.Request, res:express.Response, next: (e:any) => void) {
        const id : string = req.params.id
        try {
            const users = await userService.getPerson(id);
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async remove(req:express.Request, res:express.Response, next: (e:any) => void) {
        const id : string = req.params.id
        try {
            const users = await userService.remove(id);
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async changeMyProfile(req:express.Request, res:express.Response, next: (e:any) => void) {
        const id : string = req.params.id
        try {
            const users = await userService.changeMyProfile(id, req.body);
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async registration(req:express.Request, res:express.Response, next: (e:any) => void) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // @ts-ignore
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password, isPhotograph,  fullName, userName} = req.body;
            const userData = await userService.registration(email, password, isPhotograph,  fullName, userName);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req:express.Request, res:express.Response, next: (e:any) => void) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req:express.Request, res:express.Response, next: (e:any) => void) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async activate(req:express.Request, res:express.Response, next: (e:any) => void) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(
                process.env.CLIENT_URL||'localhost:3000'
            );
        } catch (e) {
            next(e);
        }
    }

    async refresh(req:express.Request, res:express.Response, next: (e:any) => void) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData?.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }




}