const User = require('../models/user')
const Question = require('../models/question')
const { tokenDecoder } = require('../helpers/jwt')
const Answer = require('../models/answer')

module.exports = {
  isLogin: function(req, res, next) {
    try {
      let token = req.headers.token
      if(!token) {
        res
          .status(400)
          .json({ message : `you have to be login first`})
      } else {
        let tokenDecoded = tokenDecoder(token)
        User.findOne({ email : tokenDecoded.email })
          .then( function(user) {
            if(!user) {
              res
                .status(400)
                .json({ message : `error with user login`})
            } else {
              req.headers.id = user.id
              next()
            }
          })
          .catch( function(err) {
            throw err
          })
      }
    } catch (err) {
      // console.log(err)
      res
        .status(500)
        .json({ message :`internal server error` })
    }
  },

  isAuthorize: function(req, res, next) {

    // console.log(req.params.id)
    Question.findById(req.params.id)
      .then(function(question) {
        if(!question) {
          res
            .status(400)
            .json({ message: 'there is no question with that id'})
        } else {
          // console.log(']]]]]]]]]]]]]]]]]]]]]]]]]]]]', question, req.headers.id)
          if((question.userId).toString() != (req.headers.id).toString()) {
            res
              .status(400)
              .json({ message : `invalid authorize access`})
          } else {
            next()
          }
        }
      })
      .catch( function(err) {
        res
          .status(500)
          .json(err)
      });
  },

  isAuthorizeAnswer: function(req, res,next) {

    Answer.findById(req.params.id)
    .then(function(answer) {
      if(!answer) {
        res
          .status(400)
          .json({ message: 'there is no answer with that id'})
      } else {
        // console.log(']]]]]]]]]]]]]]]]]]]]]]]]]]]]', question, req.headers.id)
        if((answer.userId).toString() != (req.headers.id).toString()) {
          res
            .status(400)
            .json({ message : `invalid authorize access`})
        } else {
          next();
        }
      }
    })
    .catch( function(err) {
      res
        .status(500)
        .json(err)
    });
  },
}