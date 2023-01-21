import { Request, Response } from 'express';
import { User, validateUser, validateLogin } from '../model/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const USER_SECRET_KEY = 'USER_SECRET_KEY';

// register controller

export const register = async (req: Request, res: Response) => {

    try {

        const { name, email, password, mobileNumber } = req.body;

        const { error } = validateUser(req.body);

        if (error) return res.status(400).send({ success: false, message: error.details[0].message, data: {} });

        const oldUser = await User.findOne({ email: email });

        if (oldUser) return res.status(400).send({ success: false, message: 'Email already exists', data: {} });

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            mobileNumber
        });

        if (!newUser) return res.status(400).send({ success: false, message: 'something went wrong', data: {} })

        const payload = {
            name, email, mobileNumber
        }

        return res.status(200).send({ success: true, message: 'Registration successfully', data: payload });

    } catch (error) {
        res.send(error);
    }
}


// login controller

export const login = async (req: Request, res: Response) => {

    try {

        const { email, password } = req.body;

        const { error } = validateLogin(req.body);

        if (error) return res.status(400).send({ success: false, message: error.details[0].message, data: {} });

        const findUser = await User.findOne({ email: email });

        if (!findUser) return res.status(404).send({ success: false, message: 'Invalid userName or password', data: {} });

        const validatePassword = bcrypt.compare(password, findUser.password);

        if (!validatePassword) return res.status(400).send({ success: false, message: 'Invalid userName or password', data: {} });

        const token = jwt.sign({ _id: findUser.id, email: email }, USER_SECRET_KEY);

        const payload = {
            _id: findUser._id,
            name: findUser.name,
            email: findUser.email,
            mobileNumber: findUser.mobileNumber,
            token
        }

        return res.status(200).send({ success: true, message: 'Login successfully', data: payload });

    } catch (error) {
        res.send(error)
    }

}
