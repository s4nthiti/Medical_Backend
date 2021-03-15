const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const registerService = require('./register.service');
const qs = require('qs');
const config = require('../config.json');
const axios = require('axios').default;
const db = require("../_helpers/db");
const notifyService = require('../notify/notify.service');

module.exports = router;

router.post('/save-user', saveUserSchema, saveUser);
router.get('/linecallback', saveToken);
router.post('/testSend', sendApi);

function sendApi(req, res, next) {
	const access_token = req.body.access_token;
	notifyService.sendNotify(access_token)
		.then(() => res.json({ message: 'Send message!'}))
		.catch(next);
}

function saveToken(req, res, next) {
    const userEmail = req.query.state;
    const token = req.query.code;
    registerService.saveToken({userEmail, token})
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
		redirect_uri: 'http://34.126.120.13:3000/registers/linecallback',
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
