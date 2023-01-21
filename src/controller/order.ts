import { Request, response, Response } from "express";
import { Order, validateOrder } from "../model/order";
import { Product } from "../model/product";
import { User } from "../model/user";


// get order list

export const getOrders = async (req: any, res: Response) => {

    try {

        const user = req.user

        const orderData = await Order.find({ userId: user._id });
        if (!orderData || orderData.length == 0) {
            return res.status(404).send({ success: false, message: 'You have not any order yet', data: {} });
        }
        return res.status(200).send({ success: true, message: 'Your orders', data: orderData });

    } catch (error) {
        res.send(error)
    }
}


// create order controller

export const createOrder = async (req: any, res: Response) => {

    try {

        const user = req.user;

        const userData: any = await User.findOne({ _id: user._id })

        const { product, quantity, address, mobileNumber, paymentMode } = req.body;

        const { error } = validateOrder(req.body);
        if (error) return res.status(400).send({ success: false, message: error.details[0].message, data: {} });

        const productData = await Product.findOne({ _id: product });
        if (!productData) return res.status(404).send({ success: false, message: 'Product not found', data: {} });

        console.log("productData==========>", productData);

        if (productData.quantity <= quantity) {
            return res.status(400).send({ success: false, message: 'giving quantity not available for now', data: {} })
        }

        let mobile = mobileNumber ? mobileNumber : userData.mobileNumber;

        const newOrder: any = await Order.create({
            userId: user._id,
            product: product,
            price: productData.price,
            quantity,
            totalPrice: productData.price * quantity,
            address,
            mobileNumber: mobile,
            paymentMode
        });


    } catch (error) {
        res.send(error);
    }
}