import express from 'express';
import { addProduct, filterProduct, listProduct, searchProduct } from '../controller/product';
import { adminAuth } from '../middleware/adminAuth';

const productRouter = express.Router();

productRouter.post('/addProduct', adminAuth, addProduct);

productRouter.get('/listProduct', listProduct);

productRouter.get('/searchProduct', searchProduct);

productRouter.get('/filterProduct', filterProduct);


export default productRouter