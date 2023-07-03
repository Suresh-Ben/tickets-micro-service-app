const express = require('express');
const { currentUser, NotFoundError, NotAuthorizedError } = require('@sbticketsproject/shared');
const Order = require('../db-models/order');

const router = express.Router();

router.get('/api/orders/:orderId', async(req, res) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');
    if (!order) throw new NotFoundError();

    const token = req.cookies['jwt'];
    const user = currentUser(token, process.env.JWT_KEY);
    if (order.userId !== user.id) throw new NotAuthorizedError();

    res.send(order);
});

module.exports = router;