const ListenOrderCreatedEvents = require('./events/order-created-listener');
const ListenOrderDeletedEvents = require('./events/order-deleted-listener');

async function start() {
    ListenOrderCreatedEvents();
    ListenOrderDeletedEvents();
}

module.exports = start;