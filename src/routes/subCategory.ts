import express from 'express';
import { addSubCategory } from '../controller/subCategory';
import { adminAuth } from '../middleware/adminAuth';
const subCategoryRouter = express.Router();

subCategoryRouter.post('/addSubCategory', adminAuth, addSubCategory);


export default subCategoryRouter