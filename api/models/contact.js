const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: String,
    first_name: String,
    last_name: String,
    phone_number: String,
    street: String,
    city: String,
    state: String,
    zip: String
});

module.exports = mongoose.model('Contact', contactSchema);