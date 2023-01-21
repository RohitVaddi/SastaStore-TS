import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

const ADMIN_SECRET_KEY = 'ADMIN_SECRET_KEY';

export const adminAuth = async (req: any, res: Response, next: any) => {

    try {

        const token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ succes: false, message: 'Access denied. no token provided', data: {} });

        const decoded = jwt.verify(<any>token, ADMIN_SECRET_KEY);
        if (!decoded) return res.status(401).send({ success: false, message: 'Invalid token', data: {} });

        req.user = decoded;
        next();

    } catch (error) {
        res.status(401).send({ success: false, message: 'Invalid token', data: {} });
    }
}