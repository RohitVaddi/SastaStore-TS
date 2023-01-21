import express from 'express';
import { createOrder, getOrders } from '../controller/order';
import { userAuth } from '../middleware/userAuth';


const orerRouter = express.Router();

orerRouter.get('/getOrders', userAuth, getOrders);

orerRouter.post('/createOrder', userAuth, createOrder);


export default orerRouter