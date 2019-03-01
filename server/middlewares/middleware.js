const User = require('../models/user')
const Question = require('../models/question')
const { tokenDecoder } = require('../helpers/jwt')
const Answer = require('../models/answer')
const Tag = require('../models/tag')

module.exports = {
  isLogin: function(req, res, next) {
    try {
      // console.log(req.headers)
      let token = req.headers.token
      // console.log(token)
      if(!token) {
        res
          .status(400)
          .json({ message : `you have to be login first`})
      } else {
        let tokenDecoded = tokenDecoder(token)
        console.log(tokenDecoded)
        User.findOne({ email : tokenDecoded.email })
          .then( function(user) {
            if(!user) {
              res
                .status(400)
                .json({ message : `error with user login`})
            } else {
              // console.log(user)
              req.headers.id = user.id
              next()
            }
          })
          .catch( function(err) {
            throw err
          })
      }
    } catch (err) {
      console.log(err)
      res
        .status(500)
        .json({ message :`internal server error` })
    }
  },

  isAuthorize: function(req, res, next) {

    // console.log(req.params.id)
    Question.findOne({ _id: req.params.id })
      .then(function(question) {
        if(!question) {
          res
            .status(400)
            .json({ message: 'there is no question with that id'})
        } else {
          console.log(']]]]]]]]]]]]]]]]]]]]]]]]]]]]', question.userId, req.headers.id)
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

  tagIdGenerator: function(req, res, next) {
  
    // console.log(req.body)
    req.body.tags = req.body.tags.map(tag => tag.text)
    let tagPromises = []
    let output = []
    // req.body.tags = ['js','react', 'vue']
    console.log(req.body.tags,'======================================')
    req.body.tags.forEach( tag => {
      tagPromises.push(
        new Promise ((resolve, reject) => {
          Tag.findOneAndUpdate({ name: tag }, { $set: { name: tag }}, { upsert: true, new: true }, function(err, doc) {
            resolve(doc)
          })
        })
      )
    })
  
    Promise.all(tagPromises)
      .then(function(tags) {
        console.log(tags,'==================================|||||')
        tags.forEach( tag => {
          output.push(tag._id)
        })
        req.body.tags = output
        console.log(req.body.tags)
        next()
      })
      .catch(function(err) {
        console.log(err)
        next()
      })
  },
}