const db = require("../_helpers/db");
const recordService = require('../records/record.service');

module.exports = {
    addPatient,
    deletePatient,
    updatePatient,
    getPatient,
    getAllPatient,
    getAllPatientNoRoom,
    getById,
    getByBed,
    removePatientfromBed,
    addPatientBed
};

async function addPatient(params, origin){
    const patient = await db.Patient.findOne({name: params.name});
    if(patient)
        return 'error';
    const newPatient = new db.Patient(params);
    newPatient.bedNo = 0;
    await newPatient.save();
    return 'success';
}

async function deletePatient(userid){
    const patient = await db.Patient.findById(userid);
    await patient.remove();
    return 'success';
}

async function removePatientfromBed(params){
    if(params > 0 && params < 34)
    {
        const patient = await db.Patient.findOne({bedNo: params});
        if(!patient)
            return 'error';
        recordService.deleteByBed(patient.bedNo);
        patient.bedNo = 0;
        await patient.save();
        return 'success';
    }
    return 'error';
}

async function updatePatient(params){
    const patient = await db.Patient.findOne({rn: params.rn});

    patient.name = params.name;
    patient.age = params.age;
    await patient.save();
    return 'success';
}

async function addPatientBed(params){
    const patient = await db.Patient.findOne({bedNo: params.bedNo});
    if(patient)
        return 'error';

    const newPatient = await db.Patient.findOne({name: params.patientName});
    newPatient.bedNo = params.bedNo;
    await newPatient.save();
    return 'success';
}

async function getPatient(pname){
    const patient = await db.Patient.findOne({name: pname});
    return patient;
}

async function getAllPatient(){
    const patients = await db.Patient.find();
    return patients;
}

async function getAllPatientNoRoom(){
    const patients = await db.Patient.find({bedNo: '0'});
    return patients;
}

async function getById(params){
    const patient = await db.Patient.findOne({_id: params.id});
    return patient;
}

async function getByBed(bed){
    if(!(bed > 0 && bed < 34))
        return 'error';
    const patient = await db.Patient.findOne({ bedNo: bed });
    if(patient)
        return patient;
    else
        return 'error';
}

function basicDetails(patient) {
    const { name } = patient;
    return { name };
}