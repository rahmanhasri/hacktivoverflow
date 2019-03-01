const User = require('../models/user')
const { compareHash } = require('../helpers/bcrypt')
const { tokenGenerator } = require('../helpers/jwt')
const { validationMessage } = require('../helpers/validation')
const Tag = require('../models/tag')


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

    // console.log(req.body.email)
    User.findOne({ email : req.body.email })
      .then( function(user) {
        // console.log(user)
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

  getTag: function(req, res) {
    User.findOne({_id: req.header.id}).populate('subscribes')
      .then(function(user) {
        res.status(200).json(user.subscribes)
      })
      .catch(function(err) {
        console.log(err)
        res.status(500).json({ message: 'internal server error' })
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
  },

  subscribeTag: function(req, res) {

    let foundTag = null
    Tag.findOne({ name: req.params.name })
      .then(function(tag) {
        // console.log(tag)
        if(!tag) {
          return null
        } else {
          foundTag = tag
          return User.findOne({ _id: req.headers.id })
        }
      })
      .then(function(user) {
        if(!user) {
          return null
        } else {
          console.log(user.subscribes, foundTag._id)
          if(user.subscribes.indexOf(foundTag._id.toString() !== -1)) {
            return false
          } else {
            return User.findOneAndUpdate({ _id: req.headers.id }, { $push: { subscribes: foundTag._id }}, { new: true }).populate('subscribes')
          }
        }
      })
      .then(function(user) {
        if(user === null) {
          res.status(404).json({ message: 'not found' })
        } else if(user === false) {
          res.status(200).json({ message: 'You already subscribes this' })
        } else {
          res.status(200).json({ message: `${foundTag.name} subscribed succesfully`, data: user })
        }
      })
      .catch(function(err) {
        console.log(err)
        res.status(500).json({ message: 'internal server error' })
      })
  }
}