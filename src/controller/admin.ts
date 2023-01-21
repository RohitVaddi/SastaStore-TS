import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Admin, validateAdmin, validateAdminLogin } from '../model/admin';

const ADMIN_SECRET_KEY = 'ADMIN_SECRET_KEY';

// register controller

export const adminRegister = async (req: Request, res: Response) => {

    try {

        const { name, email, password } = req.body;

        const { error } = validateAdmin(req.body);

        if (error) return res.status(400).send({ success: false, message: error.details[0].message, data: {} });

        const oldUser = await Admin.findOne({ email: email });

        if (oldUser) return res.status(400).send({ success: false, message: 'Email already exists', data: {} });

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await Admin.create({
            name,
            email,
            password: hashPassword
        });

        if (!newUser) return res.status(400).send({ success: false, message: 'something went wrong', data: {} })

        const payload = {
            name, email
        }

        return res.status(200).send({ success: true, message: 'Registration successfully', data: payload });

    } catch (error) {
        res.send(error);
    }
}


// login controller

export const adminLogin = async (req: Request, res: Response) => {

    try {

        const { email, password } = req.body;

        const { error } = validateAdminLogin(req.body);

        if (error) return res.status(400).send({ success: false, message: error.details[0].message, data: {} });

        const findUser = await Admin.findOne({ email: email });

        if (!findUser) return res.status(404).send({ success: false, message: 'Invalid userName or password', data: {} });

        const validatePassword = bcrypt.compare(password, findUser.password);

        if (!validatePassword) return res.status(400).send({ success: false, message: 'Invalid userName or password', data: {} });

        const token = jwt.sign({ _id: findUser.id, email: email }, ADMIN_SECRET_KEY);

        const payload = {
            _id: findUser._id,
            name: findUser.name,
            email: findUser.email,
            token
        }

        return res.status(200).send({ success: true, message: 'Login successfully', data: payload });

    } catch (error) {
        res.send(error)
    }

}
