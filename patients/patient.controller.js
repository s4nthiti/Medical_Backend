const express = require('express');
const router = express.Router();
const Joi = require('joi');
const patientService = require('./patient.service');
const validateRequest = require('../_middleware/validate-request');

module.exports = router;

router.post('/add', addPatientSchema, addPatient);
router.get('/:name', getPatient);
router.get('/', getAllPatient);
router.get('/bed/:bedNo', getByBed);
router.get('/remove/:bedNo', removePatientfromBed);
router.get('/addBed/:patientName&:bedNo', addPatientBed);

function addPatientSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
        rn: Joi.string().required(),
        an: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function addPatient(req, res, next) {
    patientService.addPatient(req.body, req.get('origin'))
        .then(result => {
            if(result === 'error')
                res.json('none');
            else
                res.json(result);
        })
        .catch(next);
}

function removePatientfromBed(req, res, next) {
    patientService.removePatientfromBed(req.params.bedNo, req.get('origin'))
        .then(result => {
            if(result === 'error')
                res.json('none');
            else
                res.json(result);
        })
        .catch(next);
}

function addPatientBed(req, res, next) {
    console.log(req.params);
    patientService.addPatientBed(req.params, req.get('origin'))
        .then(result => {
            if(result === 'error')
                res.json('none');
            else
                res.json(result);
        })
        .catch(next);
}

function getPatient(req, res, next) {
    patientService.getPatient(req.params.name)
        .then(patient => patient ? res.json(patient) : res.sendStatus(404))
        .catch(next);
}

function getByBed(req, res, next) {
    patientService.getByBed(req.params.bedNo)
        .then(result => {
            if(result === 'error')
                res.json('none');
            else
                res.json(result);
        })
        .catch(next);
}

function getAllPatient(req, res, next) {
    patientService.getAllPatient()
        .then(patients => patients ? res.json(patients) : res.sendStatus(404))
        .catch(next);
}

/*function getPatient(req, res, next) {
    patientService.getPatient(req.body, req.get('origin'))
        .then(patients => res.json(patients))
        .catch(next);
}*/