import mongoose, { Schema } from "mongoose";
import Joi from "joi";
import { I_Order } from "../interface";

const orderSchema: Schema<I_Order> = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    totalPrice: {
        type: Number
    },
    address: {
        type: String
    },
    mobileNumber: {
        type: Number
    },
    paymentMode: {
        type: String,
        default: 'COD'
    }
});

export const Order = mongoose.model('Order', orderSchema);

export const validateOrder = (Order: I_Order) => {
    return Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().required(),
        address: Joi.string().min(10).required(),
        mobileNumber: Joi.number().min(1111111111).max(9999999999),
        paymentMode: Joi.string()
    }).validate(Order);
}


export const validateCartOrder = (Order: I_Order) => {
    return Joi.object({
        address: Joi.string().min(10).required(),
        mobileNumber: Joi.number().min(1111111111).max(9999999999),
        paymentMode: Joi.string()
    }).validate(Order);
}