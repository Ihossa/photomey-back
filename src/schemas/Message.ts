import { Schema } from 'mongoose';
import * as mongoose from "mongoose";

interface IMessageSchema{
    text: {
        type: string,
        require: boolean
    },
    dialog: {
        type: Schema.Types.ObjectId,
        ref: string,
        require: boolean
    },
    unread: {
        type: boolean,
        default: boolean
    },
}

const MessageSchema = new Schema({
    text: {
        type: String,
        require: true
    },
    dialog: {
        type: Schema.Types.ObjectId,
        ref: "Dialog",
        require: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    unread: {
        type:Boolean,
        default: false
    },
},{
    timestamps: true
})

const Message = mongoose.model<IMessageSchema>("Message", MessageSchema)

export default Message