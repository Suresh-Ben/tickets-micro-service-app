const Order = require('./db-models/order');
const { nats, publishEvent, OrderExpiredSchema } = require('@sbticketsproject/shared');

async function clearCache() {
    const orders = await Order.find({
        expired: false
    });

    orders.map((order) => {
        const now = new Date();
        const expiresAt = new Date(order.expiresAt);
        const TimeToCancelOrder = expiresAt.getTime() - now.getTime();
        console.log('working: ' + TimeToCancelOrder);

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
        }, TimeToCancelOrder <= 0 ? 0 : TimeToCancelOrder);
    });
}

module.exports = clearCache;