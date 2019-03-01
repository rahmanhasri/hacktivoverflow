const { Tag, Question } = require('../server/models/question')
const mongoose = require('mongoose')
const NODE_ENV = process.env.NODE_ENV || 'development';
mongoose.connect(`mongodb://localhost:27017/hacktivoverflow${NODE_ENV}`, { useNewUrlParser : true })

// Tag.create({name: 'js'})
//   .then(function(newTag) {
//     console.log(newTag)
//   })
//   .catch(function(err) {
//     console.log(err)
//   })


    // Tag.findOneAndUpdate({ name: this.tags[0] }, { $set: { name: this.tags[0] }}, { upsert: true  })
  //   .then(function(tag) {
  //     console.log(tag)
  //     next()
  //   })
  //   .catch(function(err) {
  //     console.log(err)
  //     next()
  //   })