import { Schema } from 'mongoose';
import * as mongoose from "mongoose";
import { generatePasswordHash } from '../utils'


export interface IUserSchema extends mongoose.Document{
    email: string,
    userName?: string,
    fullName?: string,
    phoneNumber?: string,
    avatar?:  {
        data: Buffer,
        contentType: String
    }
    password?: string,
    experience?: number
    price?: number[],
    description?: string,
    birth?:  Date,
    gender?: string,
    workCondition?: string,
    locationWork?: string,
    addFunctionality?: string[],
    plan?: string,
    savedPhotos?: [{
        type: Schema.Types.ObjectId,
        ref: string
    }],
    savedUser?: [{
        type: Schema.Types.ObjectId[],
        ref: string
    }],
    isPhotograph?: boolean,
    isActivated: boolean,
    activationLink?: {type: String},
}

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        // validate: [isEmail, 'invalid email'],
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    avatar: {
        type: {
            data: Buffer,
            contentType: String
        }
    },
    password: {
        type: String,
        required: true,
    },
    photoshootsTypes: {
        type: [String]
    },
    experience: {
        type: Number
    },
    price: {
        type: [Number],
    },
    description: {
        type: String,
    },
    birth: {
        type: Date,
    },
    gender: {
        type: String,
    },
    workCondition: {
        type: String,
    },
    locationWork: {
        type: String,
    },
    addFunctionality: {
        type:[String]
    },
    savedPhotos: [{
        type: Schema.Types.ObjectId,
        ref: "Images"
    }],
    savedUser: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    isPhotograph: {
        type: Boolean,
        required: true
    },
    lastSeen: {
        type: Date,
        default: new Date()
    },
    isActivated: {
        required: true,
        type: Boolean,
        default: false
    },
    activationLink: {type: String}

},{
    timestamps: true
})



const User = mongoose.model<IUserSchema>("User", UserSchema)

export default User