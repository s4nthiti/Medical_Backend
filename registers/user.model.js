const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    email: { type: String, unique: true, required: true },
    phoneNumber: {type: String, required: true },
    fullName: { type: String, required: true },
});

module.exports = mongoose.model('User', schema);
