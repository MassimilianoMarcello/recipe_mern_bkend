import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import validateEmail from '../utils/validateEmail.js';
import validatePassword from '../utils/validatePassword.js';
import matchPasswords from '../utils/matchPasswords.js';
import hashPassword from '../utils/hashPassword.js';

import User from '../models/user.js';

const userControllers = {
    register: async (req, res) => {
        try {
            const { email, password, rePassword } = req.body;
            // check if user already exists
            const userExist = await User.findOne({ email });
            if (userExist) {
                return res
                    .status(400)
                    .json({ msg: 'User already exists, please login' });
            }

            // validate email, password and rePassword
            const isValidEmail = validateEmail(email);
            const isValidPassword = validatePassword(password);
            const isMatchPassword = matchPasswords(password, rePassword);

            if (isValidEmail && isValidPassword && isMatchPassword) {
                // hash password
                const hashedPassword = hashPassword(password);

                const newUser = new User({
                    email,
                    password: hashedPassword
                });

                await newUser.save();

                res.status(201).json(newUser);
            } else {
                return res.status(400).json({
                    message: 'Invalid email or password.'
                });
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // check if user exists
            const userExist = await User.findOne({ email });
            if (!userExist) {
                return res
                    .status(400)
                    .json({ msg: 'Invalid credentials, please try again' });
            }

            bcrypt.compare(password, userExist.password, (err, isValid) => {
                if (err) {
                    return res.status(400).json({ msg: err.message });
                }

                if (isValid) {
                    // create token
                    const token = jwt.sign(
                        { userExist },
                        process.env.TOKEN_SECRET
                    );

                    // create cookie
                    res.cookie('token', token, { httpOnly: true });

                    res.status(200).json(userExist);
                } else {
                    return res
                        .status(400)
                        .json({ msg: 'Invalid credentials, please try again' });
                }
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    logout: (req, res) => {
        res.clearCookie('token');
        res.status(200).json({ msg: 'Logout successful' });
    }
};

export default userControllers;
