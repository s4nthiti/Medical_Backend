const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: true},
    age: { type: Number, required: true},
    rn: { type: String, required: true},
    an: { type: String, required: true},
    bedNo: { type: Number, required: true}
});

module.exports = mongoose.model('Patient', schema);