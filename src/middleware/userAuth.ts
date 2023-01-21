import { Response } from "express";
import jwt from 'jsonwebtoken';

const USER_SECRET_KEY = 'USER_SECRET_KEY';

export const userAuth = async (req: any, res: Response, next: any) => {

    try {

        const token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ success: false, message: 'Access denied. no token provided', data: {} })

        const decoded = jwt.verify(<any>token, USER_SECRET_KEY);
        if (!decoded) return res.status(401).send({ success: false, message: 'Invalid token', data: {} })

        req.user = decoded;
        next();

    } catch (error) {
        res.status(401).send({ success: false, message: 'Invalid token', data: {} })
    }
}