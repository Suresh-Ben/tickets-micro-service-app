const ListenTicketCreatedEvents = require('./events/ticket-created-listener');
const ListenTicketUpdatedEvents = require('./events/ticket-updated-listener');
const ListenOrderExpiredEvents = require('./events/order-expired-listener');

async function start() {
    ListenTicketCreatedEvents();
    ListenTicketUpdatedEvents();
    ListenOrderExpiredEvents();
}

module.exports = start;