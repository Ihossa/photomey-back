import { Schema } from 'mongoose';
import * as mongoose from "mongoose";

interface IDialogSchema{
    author: {
        type: Schema.Types.ObjectId,
        ref: string
    },
    partner: {
        type: Schema.Types.ObjectId,
        ref: string
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: string
    }
}

const DialogSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    partner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        require: true

    }
},{
    timestamps: true
})

const Dialog = mongoose.model<IDialogSchema>("Dialog", DialogSchema)

export default Dialog