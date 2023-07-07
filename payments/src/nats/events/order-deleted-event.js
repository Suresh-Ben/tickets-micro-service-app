const { nats, Listener, OrderDeletedSchema, OrderStatus } = require('@sbticketsproject/shared');
const Order = require('../../db-models/order');

function ListenOrderDeletedEvents() {
    const stan = nats.client();

    const orderDeletedListener = new Listener(stan, OrderDeletedSchema.channel, 'pyaments-order-deleted');
    orderDeletedListener.onListen(onMessage);
}

const onMessage = async(data, msg) => {
    const orderData = OrderDeletedSchema.validate(data);

    const order = await Order.findById(orderData.orderId);
    if (order.version != orderData.previousVersion) return;

    //refund if alreay completed
    if (order.status == OrderStatus.Complete) {
        //refund
    }

    order.set({
        status: OrderStatus.Cancelled
    });
    await order.save();

    msg.ack();
}

module.exports = ListenOrderDeletedEvents;