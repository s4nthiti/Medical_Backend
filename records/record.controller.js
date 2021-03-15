const express = require('express');
const router = express.Router();
const Joi = require('joi');
const recordService = require('./record.service');
const validateRequest = require('../_middleware/validate-request');

module.exports = router;

router.post('/add', addRecordSchema, addRecord);
router.get('/:bedNo', getRecord);
router.get('/delete/:_id', deleteRecord);

function getRecord(req, res, next) {
    recordService.getRecord(req.params.bedNo)
    .then(result => {
        if(result === 'error')
            res.json('none');
        else
            res.json(result);
    })
    .catch(next);
}

function addRecordSchema(req, res, next) {
    const schema = Joi.object({
        bedNo: Joi.number().required(),
        medicationName: Joi.string().required(),
        startdate: Joi.date().required(),
        enddate: Joi.date().required(),
        time: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function addRecord(req, res, next) {
    console.log(req.body.bedNo);
    console.log(req.body.medicationName);
    console.log(req.body.startdate);
    console.log(req.body.enddate);
    console.log(req.body.time);
    recordService.addRecord(req.body, req.get('origin'))
        .then(result => {
            if(result === 'error')
                res.json('none');
            else
                res.json(result);
        }).catch(next);
    /*patientService.addPatient(req.body, req.get('origin'))
        .then(result => {
            if(result === 'error')
                res.json('none');
            else
                res.json(result);
        })
        .catch(next);*/
}

function deleteRecord(req, res, next){
    recordService.deleteRecord(req.params._id)
        .then(result => {
            if(result === 'error')
                res.json('none');
            else
                res.json(result);
        }).catch(next);
}