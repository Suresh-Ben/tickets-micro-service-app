const { nats, Listener, OrderCreatedSchema, PaymentCreatedSchema, publishEvent } = require('@sbticketsproject/shared');
const Order = require('../../db-models/order');

function ListenOrderCreatedEvents() {
    const stan = nats.client();

    const orderCreatedListener = new Listener(stan, OrderCreatedSchema.channel, 'pyaments-order-created');
    orderCreatedListener.onListen(onMessage);
}

const onMessage = async(data, msg) => {
    const orderData = OrderCreatedSchema.validate(data);
    const order = await Order.create({
        _id: orderData.orderId,
        price: orderData.ticket.ticketPrice,
        status: orderData.orderStatus,
        userId: orderData.userId
    });

    //publish event -- payment created 
    const stan = nats.client();
    await publishEvent(stan, PaymentCreatedSchema.channel, PaymentCreatedSchema.create({
        orderId: order._id
    }));

    msg.ack();
}

module.exports = ListenOrderCreatedEvents;