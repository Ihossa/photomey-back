import express from "express";
import {UserModel} from "../schemas";
import createJWToken from "../utils/createJWToken";
import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import socket from 'socket.io'


export default class UserControllers {
    io: socket.Server

    constructor(io: socket.Server) {
        this.io = io
    }

    show = (req: express.Request, res: express.Response) =>  {
        const id : string = req.params.id
        UserModel.findById(id, (err: any, user: any) => {
                if(err){
                   return  res.status(404).json({message:"not found"})
                }
                res.json(user)
        })
    }

    me(req: any, res: express.Response) {
        const id = req.user._id
        UserModel.findById(id, (err: any, user: any) => {
            if(err){
                return  res.status(404).json({message:"not found"})
            }
            res.json(user)
        })
    }

    changeMyProfile(req: any, res: express.Response) {
        const id = req.user._id
        UserModel.findOneAndUpdate({_id: id}, req.body, {new: true}, (err: any,) => {
            console.log(req.body, id)
            if (err) return res.send( {error: err});
            return res.send('Succesfully saved.');
        })
    }

    registrate(req: any, res: express.Response){
        const postData = {
            userName: req.body.userName,
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            isPhotograph: req.body.isPhotograph
        }
        const user = new UserModel(postData)
        user
            .save()
            .then((resData) =>
                res.json(resData)
            )
            .catch(err => {
                res.json(err)
            })
    }

    remove = (req: express.Request, res: express.Response) =>  {
        const id : string = req.params.id
        UserModel.findOneAndRemove({_id: id}).then((user) => {
            if(user){
                res.json({
                    message: "User remove"
                })
            }
        }).catch(() => {
          res.status(404).json({message:"not found"});
        })
    }

    login = (req: express.Request, res: express.Response) =>  {
        const postData = {
            email: req.body.email,
            password: req.body.password,
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        UserModel.findOne({email: postData.email},(err: any, user: any) => {
            try {
                if (err) {
                    return res.status(404).json({message: "not found"})
                }

                if (bcrypt.compareSync(postData.password, user.password) &&
                    user.email === user.email
                ) {
                    const token = createJWToken(user);
                    res.json({
                        status: 'success',
                        token: token
                    })
                } else {
                    res.json({
                        status: 'error',
                        message: 'incorrect password or email'
                    })
                }
            } catch(err) {
                res.json(err)
            }
        })
    }

}