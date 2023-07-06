const ListenOrderCreatedEvents = require('./events/order-created-listener');

async function start() {
    ListenOrderCreatedEvents();
}

module.exports = start;