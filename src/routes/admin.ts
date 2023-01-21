import express from 'express';
import { adminLogin, adminRegister } from '../controller/admin';
const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);

adminRouter.post('/register', adminRegister);

export default adminRouter