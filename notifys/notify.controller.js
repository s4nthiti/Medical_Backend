const express = require('express');
const router = express.Router();
const Joi = require('joi');
const notifyService = require('./notify.service');
const validateRequest = require('../_middleware/validate-request');

module.exports = router;

router.get('/sendNotify/:_id&:nurseName', sendNotify);

function sendNotify(req, res, next) {
    notifyService.sendNotify(req.params).then(result => {
            if(result === 'error')
                res.json('none');
            else
                res.json(result);
        })
        .catch(next);
}
