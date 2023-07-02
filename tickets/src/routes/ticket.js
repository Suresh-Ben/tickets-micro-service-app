const express = require('express');
const { NotFoundError } = require('@sbticketsproject/shared');
const Ticket = require('../db-models/Ticket');

const router = express.Router();

router.get('/api/tickets/:id', async(req, res) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw new NotFoundError();
    }

    res.statusCode(200).send(ticket);
});

module.exports = router;