const express = require('express');
const router = express.Router();
const userRoute = require('./userRoute')
const questionRoute = require('./questionRoute')
const answerRoute = require('./answerRoute')

/* GET home page. */
router.use('/users', userRoute)
router.use('/questions', questionRoute)
router.use('/answers', answerRoute)

module.exports = router;
