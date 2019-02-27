const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const app = require('../app')
const User = require('../models/user')
const Question = require('../models/question')
const { tokenGenerator } = require('../helpers/jwt')
const { clearUser, clearAnswer, clearQuestion } = require('../helpers/clear')

chai.use(chaiHttp)

let token = null;
let token2 = null;
let questionId = null;
let questionIdtoUpdate = null;
let questionIdtoDelete = null;
let userId = null;
let answerId = null;

before(function(done) {
  let input = {
    name : 'userdummy',
    email : 'user@mail.com',
    password : 'cancan',
  }
  User.create(input)
    .then(function(user) {
      token = tokenGenerator(user._id, user.name, user.email)
      userId = user._id
      done()
    })
    .catch(function(err) {
      console.log(err)
      done()
    })
})

before(function(done) {
  let input = {
    name : 'userdummy2',
    email : 'user2@mail.com',
    password : 'cancan',
  }
  User.create(input)
    .then(function(user) {
      token2 = tokenGenerator(user._id, user.name, user.email)
      done()
    })
    .catch(function(err) {
      console.log(err)
      done()
    })
})

before(function(done) {
  let input = {
    title: 'Lulus hacktiv?',
    content: 'Ga mudah bro, tetaplah semangat bro',
    userId: userId
  }

  Question.create(input)
    .then(function(question) {
      questionIdtoUpdate = question._id
      done()
    })
    .catch(function(err) {
      console.log(err)
      done()
    })
})

before(function(done) {
  let input = {
    title: 'Lulus hacktiv?',
    content: 'Ga mudah bro, tetaplah semangat bro',
    userId: userId
  }

  Question.create(input)
    .then(function(question) {
      questionIdtoDelete = question._id
      done()
    })
    .catch(function(err) {
      console.log(err)
      done()
    })
})

after(function(done) {
  clearQuestion(done);
})

after(function(done) {
  clearUser(done);
})

after(function(done) {
  clearAnswer(done);
})

describe('ALL TEST', function() {

  describe('POST /register, register a new user', function() {

    it('should be send message registered successfully', function(done) {

      let input = {
        name : 'maman',
        email : 'maman@mail.com',
        password : 'cancan',
      }

      chai
        .request(app)
        .post('/users/register')
        .send(input)
        .end( function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(201)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('registered successfully')
          expect(res.body).to.have.property('data')
          expect(res.body.data._id).to.be.a('string')
          expect(res.body).to.have.property('token')
          expect(res.body.token).to.be.a('string')
          expect(res.body).to.have.property('id')
          done()
        })
    })

    it('should be send error email is taken', function(done) {

      let input = {
        name : 'maman',
        email : 'maman@mail.com',
        password : 'cancan'
      }

      chai
        .request(app)
        .post('/users/register')
        .send(input)
        .end(function(err, res) {
          // console.log(res.body)
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('message')
          // expect(res.body.message).to.equal('User validation failed: email: this email is taken. please use another email.')
          done()
        })
    })
  })

  describe('POST /login, Login a User', function() {

    it('should be send message login successful', function(done) {

      let input = {
        email: 'maman@mail.com',
        password: 'cancan',
      }

      chai
        .request(app)
        .post('/users/login')
        .send(input)
        .end(function(err, res) {
          // console.log(Object.keys(res))
          // console.log(res.status, '============')
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('login successful')
          expect(res.body).to.have.property('token')
          expect(res.body.token).to.be.a('string')
          expect(res.body).to.have.property('id')
          done()
        })
    })

    it('should be send error invalid email or password', function(done) {
      let input = {
        email : 'maman@mail.com',
        password : 'notcancan',
      }

      chai
        .request(app)
        .post('/users/login')
        .send(input)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('invalid email or password')
          done()
        })
    })
  })

  describe('POST & GET /questions', function() {
    
    let input = {
      title: 'Judul harus 10?',
      content: 'deskripsi harus sepanjang 20 karakter?',
    }
    it('should be send message a question has created successfully', function(done) {
      

      chai
        .request(app)
        .post('/questions')
        .send(input)
        .set('token', token)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(201)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('created a question successfully')
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.have.property('_id')
          questionId = res.body.data._id
          done()
        })
    })

    it('should send error you have to be login first', function(done) {

      chai
        .request(app)
        .post('/questions')
        .send(input)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('you have to be login first')
          done()
        })
    })

    it('should send error validation minimum title length', function(done) {

      let input2 = {
        title: 'pendek',
        content: '........................................', 
      }
      // done()
      chai
        .request(app)
        .post('/questions')
        .send(input2)
        .set('token', token)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('minimum title length is 10')
          done()
        })
    })

    it('should send an object of question that user click :GET', function(done) {


      chai
        .request(app)
        .get(`/questions/${questionId}`)
        .end(function(err, res) {
          console.log(res.body.data)
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.be.an('object')
          done()
        })
    })


    it('should send an array of object from questions', function(done) {

      chai
        .request(app)
        .get('/questions')
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.be.an('array')
          done()
        })
    })

    // BAGIAN SEARCH
    // it('should send an array of object from user searches', function(done) {

    //   chai
    //     .request(app)
    //     .get('/questions/search?q=lulus')
    //     .end(function(err, res) {
    //       expect(err).to.be.null
    //       expect
    //     })
    // })
  })

  describe('PUT & DELETE /questions', function() {

    it('should be send voted successfully (upvoted)', function(done) {

      chai
        .request(app)
        .patch(`/questions/${questionIdtoUpdate}?vote=1`)
        .set('token', token)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.be.an('object')
          expect(res.body.data).to.have.property('votes')
          expect(res.body.data.votes).to.have.length(1)
          done()
        })
    })

    it('should be send voted successfully (downvoted)', function(done) {

      chai
        .request(app)
        .patch(`/questions/${questionIdtoUpdate}?vote=-1`)
        .set('token', token)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.be.an('object')
          expect(res.body.data).to.have.property('votes')
          expect(res.body.data.votes).to.have.length(1)
          done()
        })
    })

    it('should be send object of votes removed (downvoted again)', function(done) {

      chai
        .request(app)
        .patch(`/questions/${questionIdtoUpdate}?vote=-1`)
        .set('token', token)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.be.an('object')
          expect(res.body.data).to.have.property('votes')
          expect(res.body.data.votes).to.have.length(0)
          done()
        })
    })

    it('should be send message you have to be login first', function(done) {

      chai
        .request(app)
        //patch.put(`/questions/${questionIdtoUpdate}?vote=1`)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('you have to be login first')
          done()
        })
    })


    it('should be send message updated question successfully', function(done) {

      let input = {
        title: 'minimum 10 karakter?',
        content: 'minimum 20 karakter sepanjang jalan kenangan'
      }

      chai
        .request(app)
        .put(`/questions/${questionIdtoUpdate}`)
        .set('token', token)
        .send(input)
        .end(function(err, res) {
          // console.log(res.body.data)
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('updated question successfully')
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.be.an('object')
          done()
        })
    })

    it('should be send error validation minimum content length', function(done) {

      let input = {
        title: 'minimum 10 karakter?',
        content: 'masa sih?'
      }

      chai
        .request(app)
        .put(`/questions/${questionIdtoUpdate}`)
        .set('token', token)
        .send(input)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('minimum content length is 20')
          done()
        })
    })

    it('should be send message deleted successfully', function(done) {

      chai
        .request(app)
        .delete(`/questions/${questionIdtoDelete}`)
        .set('token', token)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('deleted successfully')
          done()
        })
    })

    it('should be send error invalid authorized access', function(done) {
      
      let input = {
        title: 'minimum 10 karakter?',
        content: 'minimum 20 karakter sepanjang jalan kenangan'
      }

      chai
        .request(app)
        .put(`/questions/${questionIdtoUpdate}`)
        .set('token', token2)
        .send(input)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('invalid authorize access')
          done()
        })
    })
  })

  describe('POST & GET Answer', function() {

    it('should be send message posted answer successfully', function(done) {

      let input = {
        content: 'jadi jawabannya adalah'
      }

      chai
        .request(app)
        .post(`/answers/${questionIdtoUpdate}`)
        .set('token', token)
        .send(input)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(201)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('posted answers successfully')
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.have.property('_id')
          answerId = res.body.data._id
          done()
        })
    })

    it('should be send error you have to be login first', function(done) {

      let input = {
        content: 'jadi jawabannya adalah'
      }

      chai
        .request(app)
        .post(`/answers/${questionIdtoUpdate}`)
        .send(input)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('you have to be login first')
          done()
        })
    })

    it('should be send questions with populated answers GET ALL QUESTIONS', function(done) {

      chai
        .request(app)
        .get('/questions')
        .end(function(err, res) {
          // console.log(res.body.data)
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('data')
          expect(res.body.data[0]).to.have.property('answers')
          expect(res.body.data[0].answers).to.have.length(1)
          expect(res.body.data[0].answers[0]).to.be.an('object')
          done()
        })
    })

    it('should be send anwers of a question GET ANSWERS', function(done) {

      chai
        .request(app)
        .get(`/answers/question/${questionIdtoUpdate}`)
        .end(function(err, res) {
          // console.log(res.body)
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('data')
          done()
        })
    })

    it('should be send message voted successfully after vote an answer', function(done) {

      chai
        .request(app)
        .patch(`/answers/${answerId}?vote=1`)
        .set('token', token)
        .end(function(err, res) {
          // console.log(res.body)
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('voted successfully')
          expect(res.body).to.have.property('data')
          done()
        })
    })

    it('should be send error you have to be login first to vote an answer', function(done) {

      chai
        .request(app)
        .patch(`/answers/${answerId}?vote=1`)
        .end(function(err, res) {
          // console.log(res.body)
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('you have to be login first')
          done()
        })
    })
  })
})