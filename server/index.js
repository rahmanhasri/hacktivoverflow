var cron = require('node-cron');
var User = require('./models/user')

let everySunday = '0 10 * * 0'

cron.schedule(everySunday, () => {
  
});

var date = new Date();
 
var pastDate = date.getDate() - 7;
date.setDate(pastDate);
console.log(date);

