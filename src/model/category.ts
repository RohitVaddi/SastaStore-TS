import mongoose, { Schema } from "mongoose";
import Joi from "joi";
import { I_Category } from "../interface";

const categorySchema: Schema<I_Category> = new mongoose.Schema({
    category: {
        type: String
    }
});

export const Category = mongoose.model('Category', categorySchema);

export const validateCategory = (Category: I_Category) => {
    return Joi.object({
        category: Joi.string().min(3).max(20).required(),
    }).validate(Category);
}

