const { nats, Listener, TicketUpdatedSchema } = require('@sbticketsproject/shared');
const Ticket = require('../../db-models/ticket');

function ListenTicketUpdatedEvents() {
    const stan = nats.client();

    const ticketUpdatedListener = new Listener(stan, TicketUpdatedSchema.channel, 'orders-ticket-updated');
    ticketUpdatedListener.onListen(onMessage);
}

const onMessage = async(data, msg) => {
    const ticketData = TicketUpdatedSchema.validate(data);

    const ticket = await Ticket.findOne({ _id: ticketData.ticketId, version: ticketData.previousVersion });
    if (!ticket) throw new Error('ticket not found to update');

    ticket.set({
        title: ticketData.ticketName,
        price: ticketData.ticketPrice
    });
    await ticket.save();

    msg.ack();
}

module.exports = ListenTicketUpdatedEvents;