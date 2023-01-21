import mongoose, { Schema } from "mongoose";
import Joi from "joi";
import { I_Cart } from "../interface";

const cartSchema: Schema<I_Cart> = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        quantity: {
            type: Number
        },
        price: {
            type: Number
        }
    }],
    totalPrice: {
        type: Number
    }
});

export const Cart = mongoose.model('Cart', cartSchema);

export const validateCart = (Cart: I_Cart) => {
    return Joi.object({
        product: Joi.string().required().required(),
        quantity: Joi.number().required().required()
    }).validate(Cart);
}

