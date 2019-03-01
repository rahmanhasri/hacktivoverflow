const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { hashGenerator } = require('../helpers/bcrypt')

const UserSchema = new Schema({
  name: {
    type: String,
    minlength: [4, "name must be at least 4 character long"]
  },

  email: {
    type: String,
    validate: [
      {
        validator: function (value) {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value)
        },
        message: "invalid email format"
      },
      {
        isAsync: true,
        validator: function(value, callback) {
          User
          .findOne({ email : value })
            .then( (user) => {
              // console.log(user._id)
              // console.log(this._id)
              // console.log(this._id == user._id) // selalu update masukkan id nya juga
              if(user && user._id.toString() != this._id.toString()) {
                callback(false)
              } else {
                callback(true)
              }
            })
            .catch( (err) => {
              throw err
            })
        },
        message: "this email is taken. please use another email."
      }
    ]
  },

  password: {
    type: String,
    minlength: [6, "password must be at least 6 character long"]
  },
  posts: [{type: Schema.Types.ObjectId, ref: 'Question'}],
  subscribes: [{ type: Schema.Types.ObjectId, ref: 'Tag'}]
})

UserSchema.pre('save', function(next) {
  this.password = hashGenerator(this.password)
  next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User