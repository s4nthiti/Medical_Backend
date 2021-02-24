const express = require('express');
const router = express.Router();
const qs = require('qs');
const axios = require('axios').default;

const url = 'https://notify-api.line.me/api/notify';
const jsonData = {message: 'Hello Im from Thailand'};

module.exports = {
    sendNotify
};

async function sendNotify(access_Token){

	const requestOption = {
		method: 'POST',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			Authorization: 'Bearer ' + access_Token,
		},
		data: qs.stringify(jsonData),
		url
	}

	let res = await axios(requestOption);
}
