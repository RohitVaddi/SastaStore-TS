import { Request, Response } from "express";
import { SubCategory, validateSubcategory } from "../model/subCategory";

export const addSubCategory = async (req: Request, res: Response) => {

    try {

        const { category, subCategory } = req.body;

        const { error } = validateSubcategory(req.body);

        if (error) return res.status(400).send({ success: false, message: error.details[0].message, data: {} });

        const oldSubCategory = await SubCategory.findOne({ subCategory: subCategory });
        if (oldSubCategory) return res.status(400).send({ success: false, message: 'SubCategory already exists', data: {} });

        const newSubCategory = await SubCategory.create({
            category,
            subCategory
        });

        if (!newSubCategory) return res.status(400).send({ success: false, message: 'something went wrong', data: {} })

        return res.status(200).send({ success: true, message: 'SubCategory created', data: newSubCategory });

    } catch (error) {
        res.send(error)
    }

}