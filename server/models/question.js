const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const Answer = require('./answer')

const QuestionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  title: {
    type: String,
    minlength : [10, 'minimum title length is 10'],
  },
  content: {
    type: String,
    minlength : [20, 'minimum content length is 20'],
  },
  created_at: {
    type: Date,
  },
  votes: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: Number,
  }],
  // voteCounter: Number,
  answers: [{
    type: Schema.Types.ObjectId, ref: 'Answer'
  }],
  tags: [String]
})


const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question