import { Schema } from 'mongoose';
import * as mongoose from "mongoose";

interface ITypePhotoshoot {
    user: {
        type: Schema.Types.ObjectId,
        ref: string
        require: boolean
    },
    title: {
        type: string,
        require: boolean
    },
}

const TypePhotoshootSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    title: {
        type: String,
        require: true
    },
},{
    timestamps: true
})

const TypePhotoshoot = mongoose.model<ITypePhotoshoot>("TypePhotoshoot", TypePhotoshootSchema)

export default TypePhotoshoot