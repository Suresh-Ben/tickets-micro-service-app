const mongoose = require('mongoose');
const { updateIfCurrentPlugin } = require('mongoose-update-if-current');

const orderSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    ticketId: {
        type: String,
        require: true
    }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

module.exports = mongoose.model('Order', orderSchema);