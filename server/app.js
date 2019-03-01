var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const weekly = require('./helpers/weeklyReminder')
const kue = require('kue')
const queue = kue.createQueue();
const mailer = require('./helpers/nodemailer')

var app = express();

const NODE_ENV = process.env.NODE_ENV || 'development';
mongoose.connect(`mongodb://localhost:27017/hacktivoverflow${NODE_ENV}`, { useNewUrlParser : true })
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
weekly.reminder()
queue.process('email-reminder', (job,done) => {
  console.log(job.data);
  // mailer(job.data.email)
  done()
})

kue.app.listen(3001)

module.exports = app;
