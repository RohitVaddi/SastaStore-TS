import { Request, Response } from "express";
import { Category, validateCategory } from "../model/category";

export const addCategory = async (req: Request, res: Response) => {

    try {

        const { category } = req.body;

        const { error } = validateCategory(req.body);

        if (error) return res.status(400).send({ success: false, message: error.details[0].message, data: {} });

        const oldCategory = await Category.findOne({ category: category });
        if (oldCategory) return res.status(400).send({ success: false, message: 'Category already exists', data: {} });

        const newCategory = await Category.create({
            category
        });

        if (!newCategory) return res.status(400).send({ success: false, message: 'something went wrong', data: {} })

        return res.status(200).send({ success: true, message: 'Category created', data: newCategory });

    } catch (error) {
        res.send(error)
    }

}