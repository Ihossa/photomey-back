import { Schema } from 'mongoose';
import * as mongoose from "mongoose";

interface IMessageSchema{
    typePhotoshoot: {
        type: string
        require: boolean
    },
    src: {
        type: string,
        require: boolean
    },
    countLike: {
        type: string,
        require: boolean
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: string,
        require: boolean
    },
}

const MessageSchema = new Schema({
    typePhotoshoot: {
        type: String,
        require: true
    },
    src: {
        type: String,
        require: true
    },
    countLike: {
        type: String,
        require: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
},{
    timestamps: true
})

const Message = mongoose.model<IMessageSchema>("Message", MessageSchema)

export default Message