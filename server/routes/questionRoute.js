const express = require('express')
const router = express.Router()
const { isLogin, isAuthorize } = require('../middlewares/middleware')
const questionController = require('../controllers/questionController')

router.post('/', isLogin, questionController.create)

router.get('/', questionController.getQuestions)

router.get('/:id', questionController.findOne)

router.patch('/:id', isLogin, questionController.modify)

router.put('/:id', isLogin, isAuthorize, questionController.update)

router.delete('/:id', isLogin, isAuthorize, questionController.delete)


module.exports = router