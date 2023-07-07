const Order = require('../../db-models/order');
const { nats, Listener, OrderStatus, PaymentCreatedSchema, publishEvent, OrderUpdatedSchema } = require('@sbticketsproject/shared');

async function ListenPaymentCreatedEvents() {
    const stan = nats.client();

    const paymentCreatedListener = new Listener(stan, PaymentCreatedSchema.channel, 'orders-payment-created');
    paymentCreatedListener.onListen(onMessage);
}

async function onMessage(data, msg) {
    const paymentData = PaymentCreatedSchema.validate(data);

    //get order
    const order = await Order.findById(paymentData.orderId);
    const previousOrder = await Order.findById(paymentData.orderId);

    order.set({
        status: OrderStatus.AwaitingPayment
    });
    order.save();

    //publish orderupdate event
    const stan = nats.client();
    await publishEvent(stan, OrderUpdatedSchema.channel, OrderUpdatedSchema.create({
        orderId: order._id,
        orderStatus: order.status,
        version: order.version,
        previousVersion: previousOrder.version
    }));

    msg.ack();
}

module.exports = ListenPaymentCreatedEvents;