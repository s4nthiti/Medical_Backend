const lineNotify = require('line-notify-nodejs')('b2g3MAme8sGL0GLmumq0k7oka25A8GuLCrf8ONpcheK');
 
lineNotify.notify({
  message: 'www.google.com',
}).then(() => {
  console.log('send completed!');
});