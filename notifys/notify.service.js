const express = require('express');
const router = express.Router();
const qs = require('qs');
const axios = require('axios').default;
const db = require("../_helpers/db");

const url = 'https://notify-api.line.me/api/notify';

module.exports = {
    sendNotify,
	settingNotify
};

async function sendNotify(params){
	const user = await db.User.find({lineNotify: true});
	if(user.length > 0)
	{
		for(let i=0;i<user.length;i++){
			const record = await db.Record.findById(params.recordId);
			const lineToken = await db.LineToken.findOne({user: user[i]._id});

			if(record !== undefined)
			{
				const requestOption = {
					method: 'POST',
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
						Authorization: 'Bearer ' + lineToken.access_token,
					},
					data: qs.stringify({message: 'อย่าลืมให้ยา ' + record.medicationName + ' ที่เตียง ' + record.bedNo + ' สามารถทำการบันทึกเวลาให้ยาผ่านลิงค์ ' + 'http://rightdoc.ddns.net:25566/checkin'}),url
				}
				let res = await axios(requestOption);
			}
		}
		/*user.forEach(u => {
			const record = db.Record.findById(params.recordId);
			const lineToken = db.LineToken.findOne({user: u._id});
			console.log(lineToken);

			const requestOption = {
				method: 'POST',
				headers: {
					'content-type': 'application/x-www-form-urlencoded',
					Authorization: 'Bearer ' + lineToken.access_token,
				},
				data: qs.stringify({message: 'อย่าลืมให้ยา ' + record.medicationName + ' ที่เตียง ' + record.bedNo + ' สามารถทำการบันทึกเวลาให้ยาผ่านลิงค์ ' + 'http://rightdoc.ddns.net:25566/checkin'}),url
			}

			let res = axios(requestOption);
		});*/
	}
}

async function settingNotify(currentTime){
	var currentDate = new Date();
	currentDate.setHours(0);
	currentDate.setMinutes(0);
	currentDate.setSeconds(0);
	currentDate.setMilliseconds(0);
	const records = await db.Record.find({ startdate: { "$lte": currentDate}, enddate: { "$gte": currentDate}, time: currentTime + 5});
	records.forEach(record => {
		sendNotify({recordId: record.id})
	});
	const records2 = await db.Record.find({ startdate: { "$lte": currentDate}, enddate: { "$gte": currentDate}});
	records2.forEach(record => {
		CreateCheckin(record, currentDate);
	});
}

async function CreateCheckin(record, date){
	const checkin = await db.Checkin.find({ medicationId: record.id , date: date});
	if(checkin == '')
	{
		const newCheckin = new db.Checkin();
		newCheckin.medicationId = record.id;
		newCheckin.medicationName = record.medicationName;
		newCheckin.bedNo = record.bedNo;
		newCheckin.date = date;
		newCheckin.time = record.time;
		newCheckin.check = false;
		await newCheckin.save();
	}
}