const { nats, Listener, OrderUpdatedSchema } = require('@sbticketsproject/shared');
const Order = require('../../db-models/order');

function ListenOrderUpdatedEvents() {
    const stan = nats.client();

    const orderUpdatedListener = new Listener(stan, OrderUpdatedSchema.channel, 'tickets-order-updated');
    orderUpdatedListener.onListen(onMessage);
}

const onMessage = async(data, msg) => {
    const orderData = OrderUpdatedSchema.validate(data);

    //check version match
    const order = await Order.findById(orderData.orderId);
    if (!order || order.version != orderData.previousVersion) return;

    await order.save();
    msg.ack();
}

module.exports = ListenOrderUpdatedEvents;