const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const accountService = require('./account.service');
const qs = require('qs');
const config = require('../config.json');
const axios = require('axios').default;
const db = require("../_helpers/db");
const notifyService = require('../notifys/notify.service');
const authorize = require('_middleware/authorize');

module.exports = router;

router.post('/register', registerSchema, register);
router.post('/login', loginSchema, login);
router.get('/notify=:notify', authorize(), toggleNotify);
router.get('/noti', authorize(), checkNoti);
router.get('/notify', authorize(), getNotify);
router.get('/linecallback', saveToken);
router.post('/testSend', sendApi);
router.get('/getAll', authorize(), getAll);

function checkNoti(req, res, next) {
	accountService.checkNoti(req.user.id, req.get('origin'))
	.then((response) => res.json({response}))
	.catch(next);
}

function getNotify(req, res, next) {
	accountService.getNotify(req.user.id, req.get('origin'))
	.then((response) => res.json({response}))
	.catch(next);
}

function toggleNotify(req, res, next) {
	accountService.toggleNotify(req.params.notify, req.user.id, req.get('origin'))
	.then((response) => res.json({response}))
	.catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        phonenumber: Joi.string().min(10).required(),
        name: Joi.string().required(),
        password: Joi.string().min(4).required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    accountService.register(req.body, req.get('origin'))
        .then(() => res.json({ message: 'การลงทะเบียนเสร็จสิ้น' }))
        .catch(next);
}

function loginSchema(req, res, next) {
    const schema = Joi.object({
        phonenumber: Joi.string().min(10).required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function login(req, res, next) {
    const { phonenumber, password } = req.body;
    accountService.login({ phonenumber, password })
        .then((data) => {
            res.json(data);
        })
        .catch(next);
}

function getAll(req, res, next) {
	accountService.getAll()
		.then(nurses => res.json(nurses))
		.catch(next);
}

function sendApi(req, res, next) {
	const access_token = req.body.access_token;
	notifyService.sendNotify(access_token)
		.then(() => res.json({ message: 'Send message!'}))
		.catch(next);
}

function saveToken(req, res, next) {
    const phoneNumber = req.query.state;
    const token = req.query.code;
    accountService.saveToken({phoneNumber, token})
        .then(() => res.json({ message: 'การลงทะเบียนเสร็จสิ้น' }),
        	requestToken(token)
        )
        .catch(next);
}

function requestToken(tokenCode) {
	const url = 'https://notify-bot.line.me/oauth/token';
	const jsonData = {
		grant_type: 'authorization_code',
		code: tokenCode,
		redirect_uri: 'http://rightdoc.ddns.net:25566/callback',
		client_id: config.client_id,
		client_secret: config.client_secret
	}

	const requestOption = {
		method: 'POST',
		header: { 'content-type': 'application/x-www-form-urlencoded'},
		data: qs.stringify(jsonData),
		url
	}
	
	return axios(requestOption).then(async (lineRes) => {
			if(lineRes.status == 200){
				//Save to DB
				const accessToken = lineRes.data.access_token;
				const queryDb = await db.LineToken.findOne({ code: tokenCode });
				if(!queryDb)
					throw 'Database Error';
				queryDb.access_token = accessToken;
				queryDb.verified = true;
				await queryDb.save();
			}
			else{
				lineRes.sendStatus(400)

			}
		})
		.catch((err) => {
			console.error(err)
		})
	
}