import { ObjectId } from "mongoose"

export interface I_User {
    name: string,
    email: string,
    password: string,
    mobileNumber: number
}

export interface I_Admin {
    name: string,
    email: string,
    password: string
}

export interface I_Category {
    category: string
}

export interface I_SubCategory {
    category: ObjectId,
    subCategory: string
}

export interface I_Product {
    name: string,
    brand: string,
    category: ObjectId,
    subCategory: ObjectId,
    price: number,
    quantity: number
}

export interface I_Cart {
    userId: ObjectId,
    products: Array<object>,
    totalPrice: number
}

export interface I_Order {
    userId: ObjectId,
    product: ObjectId,
    price: number,
    quantity: number,
    totalPrice: number,
    address: string,
    mobileNumber: number,
    paymentMode: string
}

// name, brand, category, subcategory, price, quantity