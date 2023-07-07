const Order = require('../../db-models/order');
const { nats, Listener, OrderStatus, PaymentCompletedSchema, publishEvent, OrderCompletedSchema } = require('@sbticketsproject/shared');

async function ListenPaymentCompletedEvents() {
    const stan = nats.client();

    const paymentCompletedListener = new Listener(stan, PaymentCompletedSchema.channel, 'orders-payment-completed');
    paymentCompletedListener.onListen(onMessage);
}

async function onMessage(data, msg) {
    const paymentData = PaymentCompletedSchema.validate(data);

    //get order
    const order = await Order.findById(paymentData.orderId);
    const previousOrder = await Order.findById(paymentData.orderId);
    order.set({
        status: OrderStatus.Complete
    });
    order.save();

    //publish order update
    const stan = nats.client();
    await publishEvent(stan, OrderCompletedSchema.channel, OrderCompletedSchema.create({
        orderId: order._id,
        version: order.version,
        previousVersion: previousOrder.version
    }));

    msg.ack();
}

module.exports = ListenPaymentCompletedEvents;