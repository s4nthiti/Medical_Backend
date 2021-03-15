const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    bedNo: { type: Number, required: true },
    medicationName: { type: String, required: true },
    startdate: { type: Date, required: true },
    enddate: { type: Date, required: true },
    time: { type: Number, required: true }
});

module.exports = mongoose.model('Record', schema);