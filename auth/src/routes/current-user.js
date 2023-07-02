const express = require('express');
const { NotAuthorizedError, currentUser } = require('@sbticketsproject/shared');
const jwt = require('jsonwebtoken');

//inits
const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
    const token = req.cookies['jwt'];
    if (!token) throw new NotAuthorizedError();

    let user = currentUser(token, process.env.JWT_KEY);
    return res.status(201).send(user);
});

module.exports = router;