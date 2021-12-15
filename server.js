require('rootpath')();
const express = require('express');
const helmet = require('helmet');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('./_middleware/error-handler');
const cron = require('node-cron');
const notiService = require('./notifys/notify.service');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use(helmet());

app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

app.use('/account', require('./accounts/account.controller'));
app.use('/medicines', require('./medicines/medicine.controller'));
app.use('/patients', require('./patients/patient.controller'));
app.use('/records', require('./records/record.controller'));
app.use('/notifys', require('./notifys/notify.controller'));

app.use(errorHandler);

cron.schedule('* * * * *', function(){
  var time = new Date();
  var hTime = time.getHours() * 60;
  var mTime = time.getMinutes();
  var currentTime = (hTime + mTime);
  console.log('running a task every minute ' + currentTime);
  notiService.settingNotify(currentTime).then().catch(next);
});

const hostname = '0.0.0.0';
const port = 4000;
app.listen(port, hostname, () => {
    console.log('Server listening on port http://' + hostname + ":" + port);
});

/*const lineNotify = require('line-notify-nodejs')('b2g3MAme8sGL0GLmumq0k7oka25A8GuLCrf8ONpcheK');
 
lineNotify.notify({
  message: 'www.google.com',
}).then(() => {
  console.log('send completed!');
});*/
