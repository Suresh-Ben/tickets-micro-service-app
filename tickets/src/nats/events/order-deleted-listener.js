const { nats, Listener, OrderDeletedSchema, ticketStatus, publishEvent, TicketUpdatedSchema } = require('@sbticketsproject/shared');
const Ticket = require('../../db-models/Ticket');
const Order = require('../../db-models/order');

function ListenOrderDeletedEvents() {
    const stan = nats.client();

    const orderDeletedListener = new Listener(stan, OrderDeletedSchema.channel, 'tickets-order-deleted');
    orderDeletedListener.onListen(onMessage);
}

const onMessage = async(data, msg) => {
    const orderData = OrderDeletedSchema.validate(data);

    //check version match
    const order = await Order.findById(orderData.orderId);
    if (!order || order.version != orderData.previousVersion) return;
    await order.save();

    const previousTicket = await Ticket.findById(orderData.ticket.ticketId);
    const ticket = await Ticket.findById(orderData.ticket.ticketId);
    ticket.set({
        status: ticketStatus.Available
    });
    ticket.save();

    //publish ticket update for version updates
    const stan = nats.client();
    await publishEvent(stan, TicketUpdatedSchema.channel, TicketUpdatedSchema.create({
        ticketId: ticket._id,
        ticketName: ticket.title,
        ticketPrice: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
        previousVersion: previousTicket.version
    }));

    msg.ack();
}

module.exports = ListenOrderDeletedEvents;