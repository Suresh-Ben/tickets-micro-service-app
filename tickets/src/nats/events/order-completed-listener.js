const { nats, Listener, OrderCompletedSchema, ticketStatus, publishEvent, TicketUpdatedSchema } = require('@sbticketsproject/shared');
const Ticket = require('../../db-models/Ticket');
const Order = require('../../db-models/order');

function ListenOrderCompletedEvents() {
    const stan = nats.client();

    const orderCompletedListener = new Listener(stan, OrderCompletedSchema.channel, 'tickets-order-completed');
    orderCompletedListener.onListen(onMessage);
}

const onMessage = async(data, msg) => {
    const orderData = OrderCompletedSchema.validate(data);

    //check version match
    const order = await Order.findById(orderData.orderId);
    if (!order || order.version != orderData.previousVersion) return;
    await order.save();

    const previousTicket = await Ticket.findById(order.ticketId);
    const ticket = await Ticket.findById(order.ticketId);
    ticket.set({
        status: ticketStatus.Booked
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

module.exports = ListenOrderCompletedEvents;