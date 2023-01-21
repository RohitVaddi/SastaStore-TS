import { Request, Response } from "express";
import { Cart, validateCart } from "../model/cart";
import { Order, validateCartOrder } from "../model/order";
import { Product } from "../model/product";
import { User } from "../model/user";


// add product in cart

export const addCart = async (req: any, res: Response) => {

    try {

        const user = req.user;

        const { product, quantity } = req.body;

        const { error } = validateCart(req.body);
        if (error) return res.status(400).send({ success: false, message: error.details[0].message, data: {} });

        if (quantity <= 0) return res.status(400).send({ success: false, message: 'Quantity must be greater than zero', data: {} });

        const productData = await Product.findOne({ _id: product });
        if (!productData) return res.status(404).send({ success: false, message: 'Product not found', data: {} });

        if (productData.quantity >= quantity) {

            const cartData = await Cart.findOne({ userId: user._id });

            if (cartData) {

                const alreadyAvailabelProduct = await Cart.findOne({ products: { $elemMatch: { product: product } } });

                if (alreadyAvailabelProduct) {

                    const updateCart = await Cart.findOneAndUpdate(
                        { 'products.product': productData },
                        {
                            $inc: {
                                'products.$.quantity': quantity,
                                totalPrice: productData.price * quantity
                            }
                        }, { new: true }).populate([{ path: 'products.product', select: 'name _id brand', model: 'Product' }]);

                    if (!updateCart) return res.status(400).send({ success: false, message: ' Product not found in cart', data: {} });

                    return res.status(200).send({ success: true, message: 'Product added in cart', data: updateCart });

                } else {

                    const updateCart = await Cart.findOneAndUpdate(
                        { userId: user._id },
                        {
                            $push:
                                { products: [{ product, quantity, price: productData.price }] },
                            totalPrice: cartData.totalPrice + (productData.price * quantity)
                        },
                        { new: true }).populate([{ path: 'products.product', select: 'name _id brand', model: 'Product' }]);;

                    if (!updateCart) return res.status(400).send({ success: false, message: ' Something went wrong', data: {} });

                    return res.status(200).send({ success: true, message: 'Product added in cart', data: updateCart });

                }

            } else {

                const newCart = await (await Cart.create({
                    userId: user._id,
                    products: [{
                        product,
                        quantity,
                        price: productData.price
                    }],
                    totalPrice: productData.price * quantity
                })).populate([{ path: 'products.product', select: 'name _id brand', model: 'Product' }]);

                if (!newCart) return res.status(400).send({ success: false, message: 'Something went wrong', data: {} })

                return res.status(200).send({ success: true, message: 'Product added in cart', data: newCart });

            }
        }
        else {
            return res.status(400).send({ success: false, message: 'Selected quantity is not available for now', data: {} });
        }

    } catch (error) {
        res.send(error)
    }
}


// get cart controller

export const getCart = async (req: any, res: Response) => {

    try {

        const user = req.user;

        let cartData: any = await Cart.findOne({ userId: user._id }).populate([{ path: 'products.product', select: 'name _id brand', model: 'Product' }]);
        if (!cartData || cartData.products.length == 0) return res.status(404).send({ success: false, message: 'Your cart is empty', data: {} });

        let total = 0
        for (let index = 0; index < cartData.products.length; index++) {
            const element: any = cartData.products[index];

            if (element.product == null || element.product === undefined) {

                const id = element._id;

                total = element.quantity * element.price;

                const productData = await Cart.findOneAndUpdate(
                    { 'products._id': id },
                    {
                        $pull: { 'products': { '_id': id } },
                        $set: { totalPrice: cartData.totalPrice - total }
                    },
                    { new: true })

                return res.status(200).send({ success: true, message: 'Your cart', data: productData });

            }
        }

        return res.status(200).send({ success: true, message: 'Your cart', data: cartData });

    } catch (error) {
        res.send(error);
    }
}


// edit cart controller

export const editCart = async (req: any, res: Response) => {

    try {

        const user = req.user

        const { product, quantity } = req.body;

        const { error } = validateCart(req.body);
        if (error) return res.status(400).send({ success: false, message: error.details[0].message, data: {} });

        const prodData = await Product.findOne({ _id: product });
        if (!prodData) return res.status(404).send({ success: false, message: 'Product not found', data: {} });

        const cartData = await Cart.findOne({ userId: user._id });
        if (!cartData) return res.status(404).send({ success: false, message: 'Your cart is empty', data: {} });

        const cartProductData = await Cart.findOne({ 'products.product': product });
        if (!cartProductData) return res.status(404).send({ success: false, message: 'Product not found in cart', data: {} })

        if (quantity == 0) return res.status(400).send({ success: false, message: 'Quantity must be greater than zero', data: {} });

        for (let index = 0; index < cartData.products.length; index++) {

            const element: any = cartData.products[index];

            if (element.product == product) {

                if (prodData.quantity >= quantity + element.quantity) {

                    if (element.quantity + quantity > 0) {

                        const productData = await Cart.findOneAndUpdate(
                            { 'products.product': product },
                            {
                                $inc: {
                                    'products.$.quantity': quantity,
                                    totalPrice: element.price * quantity
                                }
                            },
                            { new: true });

                        if (!productData) return res.status(404).send({ success: false, message: 'Product not found in cart', data: {} });

                        return res.status(200).send({ success: true, message: 'Your cart updated', data: productData });

                    } else if (element.quantity + quantity == 0) {

                        let total = element.price * quantity

                        const productData = await Cart.findOneAndUpdate(
                            { 'products.product': product },
                            {
                                $pull: { 'products': { 'product': product } },
                                $inc: { totalPrice: total }
                            },
                            { new: true });

                        if (!productData) return res.status(400).send({ success: false, message: 'Product not found in cart', data: {} });

                        return res.status(200).send({ success: true, message: 'Your cart updated', data: productData });

                    } else {
                        return res.status(400).send({ success: false, message: 'Quantity is not allow because product is not allow to less than zero in cart', data: {} })
                    }

                } else {
                    return res.status(400).send({ success: false, message: 'Selected quantity is not available for now', data: {} })
                }
            }
        }

    } catch (error) {
        res.send(error)
    }
}


// remove product into cart controller

export const removeCart = async (req: any, res: Response) => {

    try {

        const user = req.user;

        const { product } = req.body;

        const prodData = await Product.findOne({ _id: product });
        if (!prodData) return res.status(404).send({ success: false, message: 'Product not found', data: {} });

        const cartData = await Cart.findOne({ userId: user._id });
        if (!cartData) return res.status(404).send({ success: false, message: 'Your cart is empty', data: {} });

        let total = 0;
        for (let index = 0; index < cartData.products.length; index++) {
            const element: any = cartData.products[index];

            if (element.product == product) {
                total = element.quantity * element.price
            }
        }

        const productData = await Cart.findOneAndUpdate(
            { 'products.product': product },
            {
                $pull: { 'products': { 'product': product } },
                $set: { totalPrice: cartData.totalPrice - total }
            },
            { new: true });

        if (!productData) return res.status(400).send({ success: false, message: 'Product not found in cart', data: {} });

        if (productData.products.length == 0) return res.status(400).send({ success: true, message: 'Your Cart is empty', data: {} });

        return res.status(200).send({ success: true, message: 'Your cart', data: productData });

    } catch (error) {
        res.send(error)
    }
}


// buy cart controller

export const buyCart = async (req: any, res: Response) => {

    try {

        const user = req.user;

        let orderProducts: any = []

        const userData: any = await User.findOne({ _id: user._id });
        if (!userData) return res.status(404).send({ success: false, message: 'User not found', data: {} })

        const { address, paymentMode, mobileNumber } = req.body;

        const { error } = validateCartOrder(req.body);
        if (error) return res.status(400).send({ success: false, message: error.details[0].message, data: {} });

        const cartData = await Cart.findOne({ userId: user._id });
        if (!cartData) return res.status(404).send({ success: false, message: 'Your cart is empty', data: {} });

        for (let index = 0; index < cartData.products.length; index++) {

            const element: any = cartData.products[index];

            const productData: any = await Product.findById({ _id: element.product });

            if (!productData && productData.quantity >= element.quantity) {
                return res.status(404).send({ success: false, message: 'Product not available for now, Please remove this product', data: productData });
            }

            let mobile = mobileNumber ? mobileNumber : userData.mobileNumber;

            const newOrder = await Order.create({
                userId: user._id,
                product: element.product,
                price: element.price,
                quantity: element.quantity,
                totalPrice: element.price * element.quantity,
                address,
                mobileNumber: mobile,
                paymentMode
            });

            if (!newOrder) return res.status(400).send({ success: false, message: 'Something went wrong', data: {} });

            // update quantity in product table =============

            let updateQty = productData.quantity - element.quantity
            const updateProduct = await Product.findOneAndUpdate(
                { _id: element.product },
                { $set: { quantity: updateQty } },
                { new: true });

            if (!updateProduct) return res.status(400).send({ success: false, message: 'Something went wrong', data: {} });

            orderProducts.push(newOrder)

        }

        // after order to make empty cart ================

        const emptyCart = await Cart.findOneAndDelete({ userId: user._id });
        if (!emptyCart) return res.status(400).send({ success: false, message: 'Something went wrong', data: {} });

        return res.status(200).send({ success: true, message: 'Your order created successfully', data: orderProducts });

    } catch (error) {
        res.send(error)
    }
}