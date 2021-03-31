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
        time: Joi.number().required(),
        nurseName: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function addRecord(req, res, next) {
    recordService.addRecord(req.body, req.get('origin'))
        .then(result => {
            if(result === 'error')
                res.json('none');
            else
            {
                notifySetup(req.body);
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