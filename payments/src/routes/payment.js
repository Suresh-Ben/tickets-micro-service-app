const express = require('express');
const Order = require('../db-models/order');
const { body, validationResult } = require('express-validator');
const { NotFoundError, currentUser, NotAuthorizedError, RequestValidationError, nats, OrderStatus, publishEvent, PaymentCompletedSchema } = require('@sbticketsproject/shared');

const router = express.Router();

router.post('/api/payments/:orderId', [
    body('paid')
    .isFloat({ gt: 0 })
    .withMessage('payment needs to happen'),
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

    const order = await Order.findById(req.params.orderId);
    if (!order) throw new NotFoundError();
    if (order.status != OrderStatus.AwaitingPayment) throw new Error('Issue with payment!!!');

    const token = req.cookies['jwt'];
    if (!token) throw new NotAuthorizedError();
    const user = currentUser(token, process.env.JWT_KEY);
    if (order.userId != user.id) throw new NotAuthorizedError();

    //check payment
    const paid = req.body.paid;
    if (paid != order.price) throw new Error('payment inaccuracy!!!');

    //publish payment completed event
    const stan = nats.client();
    await publishEvent(stan, PaymentCompletedSchema.channel, PaymentCompletedSchema.create({
        orderId: order._id,
    }));

    res.send(order);
});

module.exports = router;