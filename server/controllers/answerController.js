const Question = require('../models/question')
const Answer = require('../models/answer')
const { validationMessage } = require('../helpers/validation')

module.exports = {
  create: function(req, res) { // create
    // in case error : edit post save $push answernya ke question
    let input = {
      userId: req.headers.id,
      content: req.body.content,
      questionId: req.params.id,
    }
  
    let newAnswer = null
    Answer.create(input)
      .then(function(answer) {
        return answer.populate({ path:'userId', select: 'name' }).execPopulate()
      })
      .then(function(answer) {
        newAnswer = answer
        return Question.findOneAndUpdate({ _id: answer.questionId }, { $push: { answers: answer }}, { new: true })
      })
      .then(function() {
        res
          .status(201)
          .json({ message: 'posted answers successfully', data: newAnswer })
      })
      .catch(function(error) {
        validationMessage(error, res)
      })
  },

  getAnswer: function(req, res) { // get answer by question

    Answer.find({ questionId: req.params.id })
      .then(function(answers) {
        res
          .status(200)
          .json({ data : answers })
      })
      .catch( function(err) {
        console.log(err)
        res
          .status(500)
          .json({ message: 'interal server error' })
      }) 
  },

  findOne: function(req, res) { // findOne

    Answer.findById(req.params.id)
      .then(function(answer) {
        res
          .status(200)
          .json({ data: answer })
      })
      .catch(function(err) {
        console.log(err)
        res
          .status(500)
          .json({ message: 'internal server error'})
      })
  },

  modify: function(req, res) { // modify

    // console.log(req.query.vote, '===========')
    if(req.query.vote != -1 && req.query.vote != 1) {
      res
        .status(400)
        .json({ message: 'invalid input'})
    } else {
  
      Answer.findById(req.params.id)
      .then(function(answer) {
  
        let index = answer.votes.findIndex( vote => vote.userId == req.headers.id)
        if(index === -1) {
          answer.votes.push({ userId: req.headers.id, status: +req.query.vote})
        } else {
          if(answer.votes[index].status != req.query.vote) {
            answer.votes[index].status = +req.query.vote
          } else {
            answer.votes.splice(index,1)
          }
        }
  
        return answer.save({ new: true })
      })
      .then(function(answer) {
        return answer.populate({ path: 'userId' }).execPopulate()
      })
      .then(function(updatedAnswer) {
        res
          .status(200)
          .json({ data: updatedAnswer, message: 'voted successfully' })
      })
      .catch(function(err) {
        console.log(err)
        res
          .status(500)
          .json({ message: 'internal server error'})
      })
    }
  },

  update: function(req, res) { // update
    console.log(req.body.content)
    Answer.findByIdAndUpdate(req.params.id, { content: req.body.content }, { new: true, runValidators: true })
      .then(function(answer) {
        return answer.populate({ path: 'userId' }).execPopulate()
      })
      .then(function(updatedAnswer) {
        res
          .status(200)
          .json({ message: 'updated answer successfully', data: updatedAnswer })

      })
      .catch(function(error) {
        validationMessage(error, res)
      })
  },
}