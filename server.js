require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./_middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

app.use('/registers', require('./registers/register.controller'));
app.use(errorHandler);

const hostname = '0.0.0.0';
const port = 3000;
app.listen(port, hostname, () => {
    console.log('Server listening on port http://' + hostname + ":" + port);
});

/*const lineNotify = require('line-notify-nodejs')('b2g3MAme8sGL0GLmumq0k7oka25A8GuLCrf8ONpcheK');
 
lineNotify.notify({
  message: 'www.google.com',
}).then(() => {
  console.log('send completed!');
});*/
