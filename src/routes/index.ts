import express from 'express';
import adminRouter from './admin';
import cartRouter from './cart';
import categoryRouter from './category';
import orerRouter from './order';
import productRouter from './product';
import subCategoryRouter from './subCategory';
import userRouter from './user';

const router = express.Router();

router.use('/admin', adminRouter);

router.use('/user', userRouter);

router.use('/category', categoryRouter);

router.use('/subCategory', subCategoryRouter);

router.use('/product', productRouter);

router.use('/cart', cartRouter);

router.use('/order', orerRouter);

export default router