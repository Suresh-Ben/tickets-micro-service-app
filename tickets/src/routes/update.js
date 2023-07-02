const express = require('express');
const Ticket = require('../db-models/Ticket');
const { body, validationResult } = require('express-validator');
const { NotFoundError, currentUser, NotAuthorizedError } = require('@sbticketsproject/shared');

const router = express.Router();

router.put('/api/tickets/:id', [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be provided and must be greater than 0'),
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw new NotFoundError();

    const token = req.cookies['jwt'];
    if (!token) throw new NotAuthorizedError();
    const user = currentUser(token, process.env.JWT_KEY);
    if (user.id != ticket.userId) throw new NotAuthorizedError();

    ticket.set({
        title: req.body.title,
        price: req.body.price,
    });
    await ticket.save();

    res.send(ticket);
});

module.exports = router;