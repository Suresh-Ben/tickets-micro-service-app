const express = require('express');
const { currentUser, OrderStatus, nats, publishEvent, OrderCreatedSchema, RequestValidationError, BadRequestError, NotFoundError, NotAuthorizedError } = require('@sbticketsproject/shared');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Ticket = require('../db-models/ticket');
const Order = require('../db-models/order');

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/orders', [
    body('ticketId')
    .not()
    .isEmpty()
    .withMessage('TicketId must be provided')
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    // Make sure that this ticket is not already reserved
    const existigOrder = await Order.findOne({
        ticketId: ticketId,
        $or: [
            { status: OrderStatus.Created },
            { status: OrderStatus.AwaitingPayment },
            { status: OrderStatus.Complete }
        ]
    }).populate('ticket');
    if (existigOrder) throw new BadRequestError('This ticket is locked for payment by another user');

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const token = req.cookies['jwt'];
    const user = currentUser(token, process.env.JWT_KEY);

    const order = await Order.create({
        userId: user.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticketId: ticketId,
        ticket: ticket
    });

    // Publish an event saying that an order was created
    const stan = nats.client();
    await publishEvent(stan, OrderCreatedSchema.channel, OrderCreatedSchema.create({
        userId: order.userId,
        orderId: order._id,
        orderStatus: order.status,
        expiresAt: order.expiresAt,
        ticketId: ticket._id,
        ticketPrice: ticket.price
    }));

    res.status(201).send(order);
});

module.exports = router;