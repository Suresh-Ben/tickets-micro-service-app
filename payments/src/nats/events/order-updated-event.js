const { nats, Listener, OrderUpdatedSchema, OrderStatus } = require('@sbticketsproject/shared');
const Order = require('../../db-models/order');

function ListenOrderUpdatedEvents() {
    const stan = nats.client();

    const orderUpdatedListener = new Listener(stan, OrderUpdatedSchema.channel, 'pyaments-order-updated');
    orderUpdatedListener.onListen(onMessage);
}

const onMessage = async(data, msg) => {
    const orderData = OrderUpdatedSchema.validate(data);

    const order = await Order.findById(orderData.orderId);
    if (order.version != orderData.previousVersion) return;

    order.set({
        status: orderData.orderStatus
    });
    await order.save();

    msg.ack();
}

module.exports = ListenOrderUpdatedEvents;