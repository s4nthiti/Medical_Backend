const express = require('express');
const router = express.Router();
const qs = require('qs');
const axios = require('axios').default;
const db = require("../_helpers/db");

const url = 'https://notify-api.line.me/api/notify';
const jsonData = {message: 'Hello Im from Thailand'};

module.exports = {
    sendNotify,
    testNotify
};

async function sendNotify(access_Token){
	console.log(access_Token);
	const requestOption = {
		method: 'POST',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			Authorization: 'Bearer ' + access_Token,
		},
		data: qs.stringify(jsonData),url
	}

	let res = await axios(requestOption);
}

async function testNotify(params){
	var result;
	const lineToken = await db.LineToken.findOne({email: params.email}, (err, res) => { if(err) throw new Error(err.message, null); result = res;});
	console.log(result.access_token);
	const requestOption = {
		method: 'POST',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			Authorization: 'Bearer ' + result.access_token,
		},
		data: qs.stringify(jsonData),url
	}

	let res = await axios(requestOption);
}
