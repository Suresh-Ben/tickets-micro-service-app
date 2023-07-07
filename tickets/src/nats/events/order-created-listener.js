const { nats, Listener, OrderCreatedSchema, ticketStatus, publishEvent, TicketUpdatedSchema } = require('@sbticketsproject/shared');
const Ticket = require('../../db-models/Ticket');
const Order = require('../../db-models/order');

function ListenOrderCreatedEvents() {
    const stan = nats.client();

    const orderCreatedListener = new Listener(stan, OrderCreatedSchema.channel, 'tickets-order-created');
    orderCreatedListener.onListen(onMessage);
}

const onMessage = async(data, msg) => {
    const orderData = OrderCreatedSchema.validate(data);

    const previousTicket = await Ticket.findById(orderData.ticket.ticketId);
    const ticket = await Ticket.findById(orderData.ticket.ticketId);
    ticket.set({
        status: ticketStatus.Locked
    });
    await ticket.save();

    //create order to track versions
    const order = await Order.create({
        _id: orderData.orderId,
        ticketId: orderData.ticket.ticketId
    });

    //ticket isbeen changed... to match versions we are sending a tickect updated event
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

module.exports = ListenOrderCreatedEvents;