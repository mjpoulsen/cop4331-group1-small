const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_name: String,
    password: String,
    first_name: String,
    last_name: String,
    email: String
});

module.exports = mongoose.model('User', userSchema);