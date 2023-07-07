const Order = require('../../db-models/order');
const { nats, OrderExpiredSchema, publishEvent, OrderDeletedSchema, Listener, OrderStatus } = require('@sbticketsproject/shared');

async function ListenOrderExpiredEvents() {
    const stan = nats.client();

    const orderExpiredListener = new Listener(stan, OrderExpiredSchema.channel, 'orders-orders-expired');
    orderExpiredListener.onListen(onMessage);
}

async function onMessage(data, msg) {
    const orderData = OrderExpiredSchema.validate(data);

    //cancel order 
    const order = await Order.findById(orderData.orderId).populate('ticket');
    const previousOrder = await Order.findById(orderData.orderId).populate('ticket');

    //we cannot cancel a order when it is already completed or already been canceled by user
    if (order.status == OrderStatus.Cancelled || order.status == OrderStatus.Complete) {
        msg.ack();
        return;
    }
    order.set({
        status: OrderStatus.Cancelled
    });
    await order.save();

    //public event saying order has been canceled
    const stan = nats.client();
    await publishEvent(stan, OrderDeletedSchema.channel, OrderDeletedSchema.create({
        orderId: order._id,
        ticketId: order.ticket._id,
        version: order.version,
        previousVersion: previousOrder.version
    }));

    msg.ack();
}

module.exports = ListenOrderExpiredEvents;