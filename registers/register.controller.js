const express = require('express');
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const registerService = require('./register.service');
const router = express.Router();

module.exports = router;

router.post('/save-user', saveUserSchema, saveUser);
router.get('/linecallback', saveToken);

function saveToken(req, res, next) {
    const userEmail = req.query.state;
    const token = req.query.code;
    registerService.saveToken({userEmail, token})
        .then(() => res.json({ message: 'การลงทะเบียนเสร็จสิ้น' };
        ))
        .catch(next);
}

function saveUserSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        fullName: Joi.string().required(),
        phoneNumber: Joi.string().min(10).required()
    });
    validateRequest(req, next, schema);
}

function saveUser(req, res, next) {
    registerService.saveUser(req.body, req.get('origin'))
        .then(() => res.json({ message: 'บันทึกข้อมูลส่งในระบบเสร็จสิ้น'}))
        .catch(next);
}
