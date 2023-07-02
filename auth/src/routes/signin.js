const express = require('express');
const { body, validationResult } = require('express-validator');
const { RequestValidationError, BadRequestError } = require('@sbticketsproject/shared');
const jwt = require('jsonwebtoken');
const cookieParcel = require('../services/cookie-parcel');

//my imports
const PasswordManager = require('../services/password-manager');
const User = require('../db-models/User');

//inits
const router = express.Router();

router.post('/api/users/signin', [
    body('email')
    .isEmail()
    .withMessage('Email must be valid'),
    body('password')
    .trim()
    .notEmpty()
    .withMessage('Must spply a Password')
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

    //collect email and password
    const { email, password } = req.body;

    //get user
    const user = await User.findOne({ email: email });
    if (!user) throw new BadRequestError('Invalid credentials');

    const passwordMatch = await PasswordManager.compare(password, user.password);
    if (!passwordMatch) throw new BadRequestError('Invalid credentials');

    //store cookie
    cookieParcel(res, user._id, user.email);

    //response
    res.send({ message: 'signin succesfull!!!' });
});

module.exports = router;