const db = require("../_helpers/db");
const notifyService = require("../notifys/notify.service");

// Load the full build.
const _ = require('lodash');

// Load method categories.
const array = require('lodash/array');
const object = require('lodash/fp/object');

// Cherry-pick methods for smaller browserify/rollup/webpack bundles.
const at = require('lodash/at');
const curryN = require('lodash/fp/curryN');
const { filter } = require("lodash");

module.exports = {
    addRecord,
    getRecord,
    deleteRecord,
    timerNotify,
    getCheckin,
    checkin,
    getCheck,
    deleteByBed
};

async function addRecord(params, uid, origin){
    const user = await db.User.findOne({_id: uid});
    const record = new db.Record();
    record.bedNo = params.bedNo;
    record.startdate = params.startdate;
    record.enddate = params.enddate;
    record.medicationName = params.medicationName;
    record.time = params.time;
    record.nurse = user;
    record.nurseName = user.name;
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
    const record = await db.Record.find({ bedNo: bed }).sort({time:1});
    if(record)
        return record;
    else
        return 'error';
}

async function getCheckin(bedNo){
    let date = new Date();
    date.setHours(0,0,0,0);
    const checkin = await db.Checkin.find({bedNo: bedNo, check: false, date: date}).sort({time:1});;
    return checkin;
}

async function checkin(body){
    const checkin = await db.Checkin.findOne({_id: body.id});
    if(checkin)
    {
        const nurse = await db.User.findOne({_id: body.nurseId});
        checkin.nurseName = nurse.name;
        checkin.check = true; 
        checkin.checktime = body.time;
        await checkin.save();
        return checkin;
    }
    else
        return 'error';
}

async function getCheck(body){
    body.date.setHours(0,0,0,0);
    let startdate = body.date;
    let enddate = addDays(body.date, 6);
    let buffer = [];
    const check = await db.Checkin.find({bedNo: body.bedNo, date: { "$gte": startdate , "$lte": enddate}}).sort({medicationName:1,time:1,date:1});
    let i = 0;
    check.forEach(x => {
        let filterBuff = buffer.filter(a => a !== undefined && a.medicId.equals(x.medicationId) && a.time === x.time)[0];
        if(filterBuff === undefined)
        {
            if(buffer[i] === undefined){
                buffer[i] = {
                    medicId: x.medicationId,
                    medicName: x.medicationName,
                    time: x.time,
                    check: [],
                    checktime: []
                };
                let buffdate = body.date;
                for(let j=0;j<7;j++)
                {
                    if(x.date.getTime() === buffdate.getTime())
                    {
                        if(x.nurseName !== undefined)
                        {
                            buffer[i].check[j] = x.nurseName.split(" ")[0];
                            buffer[i].checktime[j] = x.checktime;
                        }
                        else
                        {
                            if(buffer[i].check[j] === undefined)
                            {
                                buffer[i].check[j] = '';
                                buffer[i].checktime[j] = '';
                            }
                        }
                    }
                    else
                    {
                        if(buffer[i].check[j] === undefined)
                        {
                            buffer[i].check[j] = '';
                            buffer[i].checktime[j] = '';
                        }
                    }
                    buffdate = addDays(buffdate, 1);
                }
                i++;
            }
        }
        else
        {
            let buffdate = body.date;
            for(let j=0;j<7;j++)
            {
                if(x.date.getTime() === buffdate.getTime())
                {
                    if(x.nurseName !== undefined)
                    {
                        filterBuff.check[j] = x.nurseName.split(" ")[0];
                        filterBuff.checktime[j] = x.checktime;
                    }
                    else
                    {
                        if(filterBuff.check[j] === undefined)
                        {
                            filterBuff.check[j] = '';
                            filterBuff.checktime[j] = '';
                        }
                    }
                }
                buffdate = addDays(buffdate, 1);
            }
        }
    });
    return buffer;
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

async function deleteByBed(bedNo) {
    const records = await db.Record.find({bedNo: bedNo});
    const checkins = await db.Checkin.find({bedNo: bedNo});
    await checkins.forEach(checkin => {
        checkin.remove();
    })
    await records.forEach(record => {
        record.remove();
    })
    return 'success';
}

async function deleteRecord(_id){
    const record = await db.Record.findById(_id);
    const checkins = await db.Checkin.find({medicationId: _id});
    await checkins.forEach(checkin => {
        checkin.remove();
    })
    await record.remove();
    return 'success';
}