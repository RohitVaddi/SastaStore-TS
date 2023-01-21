import mongoose, { Schema } from "mongoose";
import Joi from "joi";
import { I_Admin } from "../interface";

const adminSchema: Schema<I_Admin> = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
});

export const Admin = mongoose.model('Admin', adminSchema);

export const validateAdmin = (Admin: I_Admin) => {
    return Joi.object({
        name: Joi.string().min(3).max(20).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(15).required(),
    }).validate(Admin);
}


export const validateAdminLogin = (Admin: I_Admin) => {
    return Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }).validate(Admin);
}

