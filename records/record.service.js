const db = require("../_helpers/db");

module.exports = {
    addRecord,
    getRecord,
    deleteRecord
};

async function addRecord(params, origin){
    const record = new db.Record(params);
    await record.save();
    return 'success';
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
    console.log(_id);
    const record = await db.Record.findById(_id);
    await record.remove();
    return 'success';
}
