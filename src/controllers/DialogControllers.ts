import express from "express";
import {DialogModel, MessageModel} from "../schemas";
import socket from "socket.io";

export default class DialogControllers {

    io: socket.Server

    constructor(io: socket.Server) {
        this.io = io
    }


    index = (req: express.Request, res: express.Response) =>  {
        // @ts-ignore
        console.log(req.user._id)
        // @ts-ignore
        const authorId = req.user._id
        DialogModel.find({author: authorId})
            .populate(["author", "partner"])
            .exec(function (err: any, dialogs: any){
                if(err){
                    return  res.status(404).json(
                        {message:"Dialog is empty"}
                    )
                }
                return res.json(dialogs)
            })
        }

    // show = (req: express.Request, res: express.Response) =>  {
    //     const id : string = req.params.id
    //     DialogModel.findById(id, (err: any, user: any) => {
    //         if(err){
    //            return  res.status(404).json({message:"not found"})
    //         }
    //         res.json(user)
    //     })
    // }
    //
    create(req: any, res: express.Response){
        const postData = {
            author: req.body.author,
            partner: req.body.partner,
        }

        const dialogModel = new DialogModel(postData)
        dialogModel
            .save()
            .then((dialogData) => {
                const message = new MessageModel({
                    text: req.body.text,
                    dialog: dialogData._id,
                    user: req.body.author
                })

                message.save()
                    .then(() => {
                        dialogData.lastMessage = message._id
                        res.json( dialogData);
                    })
                    .catch(err => {
                        res.json(err)
                    })
            })
            .catch(err => {
                res.json(err)
            })
    }

    remove = (req: express.Request, res: express.Response) =>  {
        const id : string = req.params.id
        DialogModel.findOneAndRemove({_id: id})
            .then((dialog) => {
                if(dialog){
                    res.json({
                        message: "Dialog remove"
                    });
                }
        }).catch(() => {
            res.status(404).json({message:"not found"});
        })
    }
}