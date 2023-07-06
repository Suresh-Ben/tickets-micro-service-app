const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');
const { OrderStatus } = require('@sbticketsproject/shared');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created,
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    ticketId: {
        type: String,
        required: true
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
    },
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

module.exports = mongoose.model('Order', orderSchema);