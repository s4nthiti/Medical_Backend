const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    medicineName: { type: String, index: { unique: true, required: true }}}
);

module.exports = mongoose.model('Medicine', schema);
