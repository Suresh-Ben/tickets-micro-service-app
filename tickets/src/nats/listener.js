const ListenOrderCreatedEvents = require('./events/order-created-listener');
const ListenOrderDeletedEvents = require('./events/order-deleted-listener');
const ListenOrderCompletedEvents = require('./events/order-completed-listener');
const ListenOrderUpdatedEvents = require('./events/order-updated-listener');

async function start() {
    ListenOrderCreatedEvents();
    ListenOrderDeletedEvents();
    ListenOrderCompletedEvents();
    ListenOrderUpdatedEvents();
}

module.exports = start;