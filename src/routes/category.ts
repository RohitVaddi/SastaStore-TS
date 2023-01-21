import express from 'express';
import { addCategory } from '../controller/category';
import { adminAuth } from '../middleware/adminAuth';
const categoryRouter = express.Router();

categoryRouter.post('/addCategory', adminAuth, addCategory);


export default categoryRouter