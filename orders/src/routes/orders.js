const express = require('express');
const { currentUser } = require('@sbticketsproject/shared');
const Order = require('../db-models/order');

const router = express.Router();

router.get('/api/orders', async(req, res) => {
    const token = req.cookies['jwt'];
    const user = currentUser(token, process.env.JWT_KEY);

    const orders = await Order.find({
        userId: user.id,
    }).populate('ticket');

    res.send(orders);
});

module.exports = router;