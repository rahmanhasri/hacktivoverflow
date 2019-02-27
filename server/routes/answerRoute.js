const express = require('express')
const router = express.Router()
const { isLogin, isAuthorizeAnswer } = require('../middlewares/middleware')
const answerController = require('../controllers/answerController')

router.post('/:id', isLogin, answerController.create)

router.get('/question/:id', answerController.getAnswer)

router.get('/:id', answerController.findOne)

router.patch('/:id', isLogin, answerController.modify)

router.put('/:id', isLogin, isAuthorizeAnswer, answerController.update)

// router.delete('/:id', isLogin, isAuthorize, function(req, res) { // delete
  
//   Answer.findByIdAndDelete(req.params.id)
//     .then(function() {
//       res
//         .status(200)
//         .json({ message: 'deleted successfully' })
//     })
//     .catch(function(err) {
//       console.log(err)
//       res
//         .status(500)
//         .json({ message: 'internal server error'})
//     })
// })

module.exports = router