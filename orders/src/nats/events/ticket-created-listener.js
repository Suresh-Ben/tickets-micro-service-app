const { nats, Listener, TicketCreatedSchema } = require('@sbticketsproject/shared');
const Ticket = require('../../db-models/ticket');

function ListenTicketCreatedEvents() {
    const stan = nats.client();

    const ticketCreatedListener = new Listener(stan, TicketCreatedSchema.channel, 'orders-ticket-created');
    ticketCreatedListener.onListen(onMessage);
}

const onMessage = async(data, msg) => {
    const ticketData = TicketCreatedSchema.validate(data);

    const ticket = await Ticket.create({
        _id: ticketData.ticketId,
        title: ticketData.ticketName,
        price: ticketData.ticketPrice
    });

    msg.ack();
}

module.exports = ListenTicketCreatedEvents;