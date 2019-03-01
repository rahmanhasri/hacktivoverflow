const Answer = require('../models/answer');
const Question = require('../models/question');
const User = require('../models/user');
const { validationMessage } = require('../helpers/validation');
const mongoose = require('mongoose');
const Tag = require('../models/tag');

module.exports = {
  create: function(req, res) { // create
  
    let input = {
      userId: req.headers.id,
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags,
    }
  
    let newQuestion = null
    Question.create(input)
      .then(function(question) {
        newQuestion = question;
        return User.findByIdAndUpdate(req.headers.id,{  $push: { 'posts': question } });
      })
      // .then(function() {
      //   return Tag.updateMany({ _id: { $in: req.body.tags }}, { $push: { 'questions': newQuestion._id }});
      // })
      .then(function() {
        return newQuestion.populate('userId').populate('tags').execPopulate()
      })
      .then(function(question) {
        res
          .status(201)
          .json({ message: 'created a question successfully', data: question })
      })
      .catch(function(error) {
        validationMessage(error, res)
      })
  },

  getQuestions: function(req, res) { // get Questions

    // path: 'friends',
    //   // Get friends of friends - populate the 'friends' array for every friend
    //   populate: { path: 'friends' }
    Question.find({}).sort({ created_at: -1}).limit(20).populate({ path:'answers', populate: { path: 'userId' } }).populate('userId').populate('tags')
      .then(function(questions) {
        // console.log(questions)
        res
          .status(200)
          .json({ data : questions })
      })
      .catch( function(err) {
        console.log(err)
        res
          .status(500)
          .json({ message: 'interal server error' })
      })
  },

  findOne: function(req, res) { // findOne

    Question.findById(req.params.id).populate({ path: 'answers', populate: { path: 'userId' } }).populate('userId').populate('tags')
      .then(function(question) {
        if(!question) {
          res
            .status(400)
            .json({ message: `question not found` })
        } else {
          question.answers.sort( (a,b) => a.votes.length < b.votes.length)
          res
            .status(200)
            .json({ data: question })
        }
      })
      .catch(function(err) {
        console.log(err)
        res
          .status(500)
          .json({ message: 'internal server error'})
      })
  },

  modify: function(req, res) { // modify votes

    // console.log(req.query.vote)
    if(req.query.vote != -1 && req.query.vote != 1) {
      res
        .status(400)
        .json({ message: 'invalid input'})
    } else {
      Question.findById(req.params.id)
      .then(function(question) {
        // console.log(req.headers.id, '============================', question.votes[0])
        // if(question.votes.length) {
        //   console.log(question.votes[0].userId == req.headers.id)
        // }
        let index = question.votes.findIndex( vote => vote.userId == req.headers.id)
        if(index === -1) {
          // question.voteCounter += +req.query.vote
          question.votes.push({ userId: req.headers.id, status: +req.query.vote})
        } else {
          // let reset = req.query.vote == 1 ? -1 : 1
          // question.voteCounter += reset
          if(question.votes[index].status != req.query.vote) {
            question.votes[index].status = +req.query.vote
          } else {
            question.votes.splice(index,1)
          }
        }
        console.log(question)
        return question.save({ new: true })
      })
      .then(function(question) {
        res
          .status(200)
          .json({ data: question, message: 'voted successfully' })
      })
      .catch(function(err) {
        console.log(err)
        res
          .status(500)
          .json({ message: 'internal server error'})
      })
    }
  
    
  },

  update: function(req, res) { // update question

    let input = {
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags,
    }
  
    // console.log(input)
    // let updatedQuestion = null
    // Tag.updateMany({ _id: { $in: req.body.tags }}, { $pull: { 'questions': newQuestion._id }})
      // .then(function() {
    Question.findOneAndUpdate({ _id: req.params.id }, input, { new: true, runValidators: true }).populate({ path: 'answers', populate: { path: 'userId' } }).populate('userId').populate('tags')
      // })
      .then(function(question) {
        res
          .status(200)
          .json({ message: 'updated question successfully', data: question })
      })
      .catch(function(error) {
        validationMessage(error, res)
      })
  },

  delete: function(req, res) { // delete
  
    Answer.deleteMany({questionId: req.params.id})
    .then(function() {
      return Question.findOneAndDelete({_id: req.params.id})
    })
      .then(function(deleted) {
        // console.log(deleted)
        res
          .status(200)
          .json({ message: 'deleted successfully' })
      })
      .catch(function(err) {
        console.log(err)
        res
          .status(500)
          .json({ message: 'internal server error'})
      })
  },

  questionByTagId: function(req, res) {

    // let id = mongoose.Types.ObjectId(req.params.tagId)
    Question
      .find({ tags: req.params.tagId })
      .populate({ path: 'answers', populate: { path: 'userId' } })
      .populate('userId')
      .populate('tags')
      .then(function(questions) {
        res.status(200).json(questions)
      })
      .catch(function(err) {
        console.log(err)
        res.status(500).json({ message: 'internal server error' })
      });
  },

  questionByTagName: function(req, res) {

  },
}