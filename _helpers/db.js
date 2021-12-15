const config = require('config.json');
const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('accounts/user.model'),
    LineToken: require('accounts/line-token.model'),
    Medicine: require('medicines/medicine.model'),
    Patient: require('patients/patient.model'),
    Record: require('records/record.model'),
    Checkin: require('records/checkin.model'),
    isValidId
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}