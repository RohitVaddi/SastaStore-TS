import express from 'express';
import { addCart, buyCart, editCart, getCart, removeCart } from '../controller/cart';
import { userAuth } from '../middleware/userAuth';


const cartRouter = express.Router();

cartRouter.post('/addCart', userAuth, addCart);

cartRouter.get('/getCart', userAuth, getCart);

cartRouter.post('/editCart', userAuth, editCart);

cartRouter.post('/removeCart', userAuth, removeCart);

cartRouter.post('/buyCart', userAuth, buyCart);


export default cartRouter