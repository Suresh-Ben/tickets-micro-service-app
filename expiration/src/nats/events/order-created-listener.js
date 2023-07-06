const Order = require('../../db-models/order');
const { nats, OrderCreatedSchema, Listener, OrderExpiredSchema, publishEvent } = require('@sbticketsproject/shared');

async function ListenOrderCreatedEvents() {
    const stan = nats.client();

    const orderCreatedListener = new Listener(stan, OrderCreatedSchema.channel, 'expiration-order-created');
    orderCreatedListener.onListen(onMessage);
}

async function onMessage(data, msg) {
    const orderData = OrderCreatedSchema.validate(data);
    const order = await Order.create({
        _id: orderData.orderId,
        expiresAt: orderData.expiresAt,
        expired: false
    });
    msg.ack();

    const now = new Date();
    const expiresAt = new Date(orderData.expiresAt);
    const TimeToCancelOrder = expiresAt.getTime() - now.getTime();

    setTimeout(async() => {
        //publish event saying order is expired
        const stan = nats.client();
        await publishEvent(stan, OrderExpiredSchema.channel, OrderExpiredSchema.create({
            orderId: order._id
        }));

        //updating order 
        order.set({
            expired: true
        })
        await order.save();
    }, TimeToCancelOrder);
}

module.exports = ListenOrderCreatedEvents;