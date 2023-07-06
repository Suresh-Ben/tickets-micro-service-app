const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    expired: {
        type: Boolean,
        required: true,
        default: false
    },
});

module.exports = mongoose.model('Order', orderSchema);