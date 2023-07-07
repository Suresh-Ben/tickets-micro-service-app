const ListenOrderCreatedEvents = require('./events/order-created-event');
const ListenOrderDeletedEvents = require('./events/order-deleted-event');
const ListenOrderUpdatedEvents = require('./events/order-updated-event');
const ListenOrderCompletedEvents = require('./events/order-completed-event');

async function start() {
    ListenOrderCreatedEvents();
    ListenOrderDeletedEvents();
    ListenOrderUpdatedEvents();
    ListenOrderCompletedEvents();
}

module.exports = start;