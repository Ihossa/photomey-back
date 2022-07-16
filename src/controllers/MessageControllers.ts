import express from "express";
import {MessageModel} from "../schemas";
import socket from "socket.io";
import message from "../schemas/Message";

export default class MessageControllers {

    io: socket.Server

    constructor(io: socket.Server) {
        this.io = io
    }


    index = (req: express.Request, res: express.Response) => {
        const dialogId : string = req.params.dialogId
        MessageModel.find({dialog: dialogId})
            .populate(['dialog'])
            .exec(function (err: any, dialog: any){
                if(err){
                    return  res.status(404).json(
                        {message:"Dialog is empty"}
                    )
                }
                return res.json(dialog)
            })
        }

    // show(req: express.Request, res: express.Response) {
    //     const id : string = req.params.id
    //     DialogModel.findById(id, (err: any, user: any) => {
    //         if(err){
    //            return  res.status(404).json({message:"not found"})
    //         }
    //         res.json(user)
    //     })
    // }
    //
    create = (req: any, res: express.Response) => {
        const user = req.user._id

        const postData = {
            text: req.body.text,
            user: user,
            dialog: req.body.dialog,
        }
        const messageModel = new MessageModel(postData)
        messageModel
            .save()
            .then((resData) => {
                resData.populate('dialog', (err, message) => {
                    if(err) {
                        return res.status(500).json({
                            message:err
                        })
                    }
                    res.json(resData)
                    this.io.emit('message', resData)
                })
            })
            .catch(err => {
                res.json(err)
            })
    }

    remove = (req: express.Request, res: express.Response) => {
        const id : string = req.params.id
        MessageModel.findOneAndRemove({_id: id}).then((message) => {
            if(message){
                res.json({
                    message: "Message remove"
                })
            }
        }).catch(() => {
          res.status(404).json({message:"not found"});
        })
    }
}