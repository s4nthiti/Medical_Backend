const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    email: String,
    code: String,
    verified: Boolean,
    access_token: String
});

module.exports = mongoose.model('LineToken', schema);
