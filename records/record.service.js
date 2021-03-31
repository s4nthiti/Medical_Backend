const db = require("../_helpers/db");
const notifyService = require("../notifys/notify.service");

module.exports = {
    addRecord,
    getRecord,
    deleteRecord,
    timerNotify
};

async function addRecord(params, origin){
    const user = await db.User.findOne({name: params.nurseName});
    const record = new db.Record(params);
    record.nurse = user;
    await record.save();
    return 'success';
}

async function timerNotify(params){
    const record = await db.Record.findOne({medicationName: params.medicationName, bedNo: params.bedNo, startdate: params.startdate, enddate: params.enddate});
    var time = new Date();
    var hTime = time.getHours() * 60 * 60;
    var mTime = time.getMinutes() * 60;
    var sTime = time.getSeconds();
    var resTime = (params.time*60 - (hTime + mTime + sTime))*1000;
    var timer = setTimeout(notifyService.sendNotify, 1000, params); //1000ms = 1s
}

async function getRecord(bed){
    if(!(bed > 0 && bed < 34))
        return 'error';
    const record = await db.Record.find({ bedNo: bed }).sort({medicationName:1});
    if(record)
        return record;
    else
        return 'error';
}

async function deleteRecord(_id){
    const record = await db.Record.findById(_id);
    await record.remove();
    return 'success';
}