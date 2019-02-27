const bcrypt = require('bcryptjs')

module.exports = {
  hashGenerator : function(password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt)
  },

  compareHash : function(input, password) {
    return bcrypt.compareSync(input, password)
  }
}