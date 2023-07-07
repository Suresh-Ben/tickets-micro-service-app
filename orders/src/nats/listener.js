const ListenTicketCreatedEvents = require('./events/ticket-created-listener');
const ListenTicketUpdatedEvents = require('./events/ticket-updated-listener');
const ListenOrderExpiredEvents = require('./events/order-expired-listener');
const ListenPaymentCreatedEvent = require('./events/payment-created-listener');
const ListenPaymentCompletedEvents = require('./events/payment-completed-listener');

async function start() {
    ListenTicketCreatedEvents();
    ListenTicketUpdatedEvents();
    ListenOrderExpiredEvents();
    ListenPaymentCreatedEvent();
    ListenPaymentCompletedEvents();
}

module.exports = start;