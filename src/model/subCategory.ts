import mongoose, { Schema } from "mongoose";
import Joi from "joi";
import { I_SubCategory } from "../interface";

const subCategorySchema: Schema<I_SubCategory> = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategory: {
        type: String
    }
});

export const SubCategory = mongoose.model('SubCategory', subCategorySchema);

export const validateSubcategory = (SubCategory: I_SubCategory) => {
    return Joi.object({
        category: Joi.string().required(),
        subCategory: Joi.string().min(2).max(20).required(),
    }).validate(SubCategory);
}

