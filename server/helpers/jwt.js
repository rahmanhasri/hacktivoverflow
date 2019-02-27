const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
  tokenGenerator: function(id ,name, email) {
    return jwt.sign({id : id, name : name, email : email}, process.env.JWT_SECRET)
  },
  
  tokenDecoder: function decode(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  },
}