import mongoose, { Schema } from "mongoose";
import Joi from "joi";
import { I_User } from "../interface";

const userSchema: Schema<I_User> = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    mobileNumber: {
        type: Number
    }
});

export const User = mongoose.model('User', userSchema);

export const validateUser = (User: I_User) => {
    return Joi.object({
        name: Joi.string().min(3).max(20).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(15).required(),
        mobileNumber: Joi.number().min(1111111111).max(9999999999).required(),
    }).validate(User);
}


export const validateLogin = (User: I_User) => {
    return Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }).validate(User);
}

