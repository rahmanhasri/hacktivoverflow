var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
// const weekly = require('./helpers/weeklyReminder')

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
// weekly.reminder()

module.exports = app;
