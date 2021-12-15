const express = require('express');
const router = express.Router();
const Joi = require('joi');
const recordService = require('./record.service');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('_middleware/authorize');

module.exports = router;

router.post('/add', authorize(), addRecordSchema, addRecord);
router.get('/:bedNo', authorize(), getRecord);
router.get('/delete/:_id', authorize(), deleteRecord);
router.get('/deleteByBed/:bedNo', authorize(), deleteByBed);
router.get('/check/get/:bedNo', authorize(), getCheckin);
router.post('/check', authorize(), checkSchema, getCheck);
router.post('/checkin', authorize(), checkinSchema, checkin);

function deleteByBed(req, res, next){
    recordService.deleteByBed(req.params.bedNo)
    .then(result => {
        if(result === 'error')
            res.json('none');
        else
            res.json(result);
    }).catch(next);
}

function checkSchema(req, res, next) {
    const schema = Joi.object({
        bedNo: Joi.number().required(),
        date: Joi.date().required()
    });
    validateRequest(req, next, schema);
}

function getCheck(req, res, next) {
    recordService.getCheck(req.body)
        .then(result => {
            //console.log(result);
            res.json(result);
        })
        .catch(next);
}

function checkinSchema(req, res, next) {
    const schema = Joi.object({
        id: Joi.string().required(),
        time: Joi.number().required(),
        nurseId: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function checkin(req, res, next) {
    recordService.checkin(req.body)
        .then(result => {
            if(result === 'error')
                res.json('none');
            else
                res.json(result);
        })
        .catch(next);
}

function getCheckin(req, res, next) {
    recordService.getCheckin(req.params.bedNo)
        .then(result => res.json(result))
        .catch(next);
}

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
    recordService.addRecord(req.body, req.user.id, req.get('origin'))
        .then(result => {
            if(result === 'error')
                res.json('none');
            else
            {
                //notifySetup(req.body);
                res.json(result);
            }
        }).catch(next);
}

function notifySetup(params) {
    recordService.timerNotify(params);
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