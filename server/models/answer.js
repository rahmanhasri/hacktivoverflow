const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Question = require('./question')
// const Question = require('../models/question')

const AnswerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  content: {
    type: String,
    minlength : [10, 'minimum content length is 10'],
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
  votes: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: Number,
  }],
})

const Answer = mongoose.model('Answer', AnswerSchema);

module.exports = Answer