const express = require('express');
const router = express.Router();
const Joi = require('joi');
const patientService = require('./patient.service');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('_middleware/authorize');

module.exports = router;

router.post('/add', authorize(), addPatientSchema, addPatient);
router.get('/delete/:name', authorize(), deletePatient);
router.get('/:name',authorize(), getPatient);
router.get('/',authorize(), getAllPatient);
router.get('/bed/:bedNo',authorize(), getByBed);
router.get('/remove/:bedNo',authorize(), removePatientfromBed);
router.get('/addBed/:patientName&:bedNo',authorize(), addPatientBed);

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

function deletePatient(req, res, next) {
    patientService.deletePatient(req.params.name, req.get('origin'))
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