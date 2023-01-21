import mongoose, { Schema } from "mongoose";
import Joi, { string } from "joi";
import { I_Product } from "../interface";

const productSchema: Schema<I_Product> = new mongoose.Schema({
    name: {
        type: String,
    },
    brand: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    }
});

export const Product = mongoose.model('Product', productSchema);

export const validateProduct = (Product: I_Product) => {
    return Joi.object({
        name: Joi.string().min(3).max(50).required(),
        brand: Joi.string().min(3).max(20).required(),
        category: Joi.string().required(),
        subCategory: Joi.string().required(),
        price: Joi.number().min(1).required(),
        quantity: Joi.number().min(1).required(),
    }).validate(Product);
}
