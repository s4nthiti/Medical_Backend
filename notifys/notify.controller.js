const express = require('express');
const router = express.Router();
const Joi = require('joi');
const notifyService = require('./notify.service');
const validateRequest = require('../_middleware/validate-request');

module.exports = router;

router.post('/sendNotify', testNotify);

function testNotify(req, res, next) {
    notifyService.testNotify(req.body).then(result => {
            if(result === 'error')
                res.json('none');
            else
                res.json(result);
        })
        .catch(next);
}
