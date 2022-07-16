import { Schema } from 'mongoose';
import * as mongoose from "mongoose";
import validator from "validator";
import { generatePasswordHash } from '../utils'

const isEmail = validator.isEmail;

export interface IUserSchema extends mongoose.Document{
    email?: string,
    userName?: string,
    fullName?: string,
    phoneNumber?: string,
    avatarUrl?: string,
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
    isPhotograph?: boolean

}

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        validate: [isEmail, 'invalid email'],
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
    avatarUrl: {
        type: String,
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
    }

},{
    timestamps: true
})

UserSchema.pre('save', function (next){
    const user:IUserSchema = this;
    if(!user.isModified('password')) return next();
    
    generatePasswordHash(user.password).then(hash => {
        user.password = String(hash);
        next();
    }).catch(() => {next()})

})

const User = mongoose.model<IUserSchema>("User", UserSchema)

export default User