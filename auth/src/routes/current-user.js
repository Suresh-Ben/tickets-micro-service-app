const express = require('express');
const jwt = require('jsonwebtoken');

//inits
const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
    const token = req.cookies['jwt'];
    if (!token) return res.status(400).send({ currentUser: null });
    let payload = null
    try {
        //verify method throws error when token is invalid
        payload = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
        return res.status(400).send({ currentUser: null });
    }

    return res.status(201).send({
        currentUser: payload
    });
});

module.exports = router;