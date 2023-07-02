const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { RequestValidationError, BadRequestError } = require('@sbticketsproject/shared');
const cookieParcel = require('../services/cookie-parcel');

//my-imports
const PasswordManager = require('../services/password-manager');
const User = require('../db-models/User');

//inits
const router = express.Router();

router.post('/api/users/signup', [
    body('email')
    .isEmail()
    .withMessage('Email must be valid'),
    body('password')
    .trim()
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

    //collect email and password
    const { email, password } = req.body;

    //check for user existance
    const existingUser = await User.findOne({ email: email });
    if (existingUser) throw new BadRequestError('Email already in use');

    //create user
    const hashPassword = await PasswordManager.toHash(password);
    const user = await User.create({
        email: email,
        password: hashPassword
    });

    //store cookie
    cookieParcel(res, user._id, user.email);

    //response
    res.send({ message: 'User created succefully...!!!' });
});

module.exports = router;