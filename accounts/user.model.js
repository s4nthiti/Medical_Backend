const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    passwordHash: { type: String, required: true },
    role: { type: String, required: true },
    phonenumber: {type: String, unique: true, required: true },
    name: { type: String, required: true },
    lineNotify: { type: Boolean, required: true }
});

module.exports = mongoose.model('User', schema);
