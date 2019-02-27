const User = require('../models/user')
const { compareHash } = require('../helpers/bcrypt')
const { tokenGenerator } = require('../helpers/jwt')
const { validationMessage } = require('../helpers/validation')


module.exports = {
  register: function(req, res) {
    let token = null
    let input = {
      name : req.body.name,
      email : req.body.email,
      password : req.body.password,
    }
    
    User.create(input)
      .then( function(user) {
        token = tokenGenerator(user._id, user.name, user.email)
        res
          .status(201)
          .json({ message : `registered successfully`, data: user, token : token, id: user._id })
      })
      .catch(function(err) {
        // console.log('================',Object.keys(err.errors))
        validationMessage(err, res)
      })
  }, 

  login: function(req, res) {

    User.findOne({ email : req.body.email })
      .then( function(user) {
        if(!user) {
          res
            .status(400)
            .json({ message : `invalid email or password`})
        } else if(!compareHash(req.body.password, user.password)) {
          res
            .status(400)
            .json({ message : `invalid email or password`})
        } else {
          let token = tokenGenerator(user._id, user.name, user.email)
          res
            .status(200)
            .json({ message : `login successful`,token : token, id: user._id })
        }
      })
      .catch(function(err) {
        // console.log(error.message)
        validationMessage(err, res)
      })
  },

  checkUsers: function(req, res) {

    User.find({})
      .then( function(users) {
        res
          .status(200)
          .json(users)
      })
      .catch( function(err) {
        console.error(err)
        res
          .status(500)
          .json({ message : `internal server error`})
      })
  }
}