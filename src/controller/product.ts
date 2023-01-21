import { Request, Response } from "express";
import { Product, validateProduct } from "../model/product";

// addProduct controller

export const addProduct = async (req: Request, res: Response) => {

    try {

        const { name, brand, category, subCategory, price, quantity } = req.body;

        const { error } = validateProduct(req.body);

        if (error) return res.status(400).send({ success: false, message: error.details[0].message, data: {} });

        const oldProduct = await Product.findOne({ name: name });
        if (oldProduct) return res.status(400).send({ succes: false, message: 'Product already exists', data: {} })

        const newProduct = await Product.create({
            name, brand, category, subCategory, price, quantity
        });

        if (!newProduct) return res.status(400).send({ success: false, message: 'product went wrong', data: {} });

        return res.status(200).send({ success: true, message: 'Product added successfully', data: newProduct });

    } catch (error) {
        res.send(error)
    }
}


// listProduct controller

export const listProduct = async (req: Request, res: Response) => {

    try {

        const listProduct = await Product.find().populate('category').populate('subCategory');

        if (!listProduct) return res.status(404).send({ success: false, message: 'No Product available', data: {} });

        return res.status(200).send({ success: true, message: 'all Products', data: listProduct });

    } catch (error) {
        res.send(error)
    }
}


// filter product controller

export const filterProduct = async (req: Request, res: Response) => {

    try {

        const { sorting, brand, category, subCategory, min, max } = req.body

        const findObj: any = {}
        const priceFilter: any = {}
        const minMaxFilter: any = {}

        if (category != null) {
            findObj.category = category;
        }

        if (subCategory != null) {
            findObj.subCategory = subCategory;
        }

        if (brand != null) {
            findObj.brand = brand;
        }

        if (sorting == 1) {
            priceFilter.price = -1
        }
        else if (sorting == 0) {
            priceFilter.price = 1
        }

        if (min != null && max != null) {
            minMaxFilter.price = { $gte: min, $lte: max };
            findObj.price = minMaxFilter.price;
        }
        else if (min != null) {
            minMaxFilter.price = { $gte: min };
            findObj.price = minMaxFilter.price;
        }
        else if (max != null) {
            minMaxFilter.price = { $lte: max };
            findObj.price = minMaxFilter.price;
        }

        const filterProduct = await Product.find(findObj).sort(priceFilter);

        if (!filterProduct) return res.status(404).send({ success: false, message: 'No Product found', data: {} });

        return res.status(200).send({ success: false, message: 'Filter Products', data: filterProduct });

    } catch (error) {
        res.send(error);
    }
}


// searchProduct controller

export const searchProduct = async (req: Request, res: Response) => {

    try {

        const { search } = req.body;

        const subcatProduct = await Product.aggregate([
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subCategory',
                    foreignField: '_id',
                    as: 'subName'
                }
            },
            {
                $unwind: '$subName'
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'cat'
                }
            },
            {
                $unwind: '$cat'
            },
            {
                $group: {
                    _id: { subName: '$subName.subCategory', cat: '$cat.category' },
                    product: { $push: '$name' }
                }
            },

        ]);

        // console.log("subcatProduct=============>", subcatProduct);

        let subCat = subcatProduct.filter(prod => new RegExp(search, 'i').exec(prod._id.subName) || new RegExp(search, 'i').exec(prod._id.cat));

        // console.log("subcat========>", subCat);

        let productData, products = [];
        for (let i = 0; i < subCat.length; i++) {
            const x = subCat[i];

            for (let j = 0; j < x.product.length; j++) {
                const y = x.product[j];
                products.push(y)
            }
        }
        // console.log("products======>", products);

        productData = await Product.find({ name: { $in: products } });

        if (!searchProduct) return res.status(404).send({ success: false, message: 'No Product found', data: {} });

        return res.status(200).send({ success: true, message: 'Search Products', data: productData });

    } catch (error) {
        res.send(error);
    }
}
