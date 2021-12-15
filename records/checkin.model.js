const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    medicationId: { type: Schema.Types.ObjectId, ref: 'Record' , required: true },
    medicationName: { type: String, required: true},
    bedNo: { type: Number, required: true },
    date: { type: Date, required: true },
    checktime: { type: Number },
    time: { type: Number, required: true },
    check: { type: Boolean, required: true },
    nurseName: { type: String }
});

module.exports = mongoose.model('Checkin', schema);