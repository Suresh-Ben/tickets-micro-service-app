const { nats, Listener, OrderCompletedSchema, OrderStatus } = require('@sbticketsproject/shared');
const Order = require('../../db-models/order');

function ListenOrderCompletedEvents() {
    const stan = nats.client();

    const orderCompletedListener = new Listener(stan, OrderCompletedSchema.channel, 'pyaments-order-completed');
    orderCompletedListener.onListen(onMessage);
}

const onMessage = async(data, msg) => {
    const orderData = OrderCompletedSchema.validate(data);

    const order = await Order.findById(orderData.orderId);
    if (order.version != orderData.previousVersion) return;

    order.set({
        status: OrderStatus.Complete
    });
    await order.save();

    msg.ack();
}

module.exports = ListenOrderCompletedEvents;