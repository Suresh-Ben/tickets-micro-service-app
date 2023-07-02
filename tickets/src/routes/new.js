const express = require('express');
const { body, validationResult } = require('express-validator');
const Ticket = require('../db-models/Ticket');
const { currentUser, nats, TicketCreatedSchema, publishEvent } = require('@sbticketsproject/shared');

const router = express.Router();

router.post('/api/tickets', [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be greater than 0'),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

        const token = req.cookies['jwt'];
        const user = currentUser(token, process.env.JWT_KEY);
        const { title, price } = req.body;

        //create and save ticket in database
        const ticket = await Ticket.create({
            title: title,
            price: price,
            userId: user.id
        });

        //publish ticket created event
        const stan = nats.client();
        publishEvent(stan, TicketCreatedSchema.channel, TicketCreatedSchema.create({
            ticketId: ticket._id,
            ticketName: ticket.title,
            ticketPrice: ticket.price,
            userId: ticket.userId
        }));

        //send back ticket to user
        res.status(201).send(ticket);
    });

module.exports = router;