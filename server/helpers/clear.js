const User = require('../models/user');
const Question = require('../models/question');
const Answer = require('../models/answer');

module.exports = {
  clearQuestion: function(done) {
    if (process.env.NODE_ENV === 'test') {
      Question
        .deleteMany({})
        .then(function() {
          done();
        })
        .catch(function(err) {
          console.log(err);
          done()
        });
    }
  },

  clearUser: function(done) {
    if (process.env.NODE_ENV === 'test') {
      User
        .deleteMany({})
        .then(function() {
          done();
        })
        .catch(function(err) {
          console.log(err);
          done()
        });
    }
  },

  clearAnswer: function(done) {
    if (process.env.NODE_ENV === 'test') {
      Answer
        .deleteMany({})
        .then(function() {
          done()
        })
        .catch(function(err) {
          console.log(err)
          done()
        })
    }
  }
}