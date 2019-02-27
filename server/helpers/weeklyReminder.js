const kue = require('kue')
const queue = kue.createQueue();
const cron = require('node-cron');
const User = require('../models/user');
const Question =require('../models/question');
const mailer = require('../helpers/nodemailer')
const everySunday = '0 10 * * 0';
let sendEmailsTo = [];
let emails = [];

module.exports = {
  reminder: function() {
    cron.schedule(everySunday, () => {
  
      User.find({}).select('_id').select('email')
        .then(function(users) {
          // console.log(users)
          let array = [];
          users.forEach( user => {
            emails.push(user.email);
            array.push(Question.find({ userId: user._id, created_at: { $lt: new Date(), $gte: new Date().setDate(new Date().getDate() - 7)}}));
          })
          return Promise.all(array)
        })
        .then(function(output) {
          // console.log(output)
          output.forEach((a, index) => {
            if(!a.length) {
              // sendEmailsTo.push({ email: emails[index]})
              queue.create('email-reminder', {
                email : emails[index]
              }).save()
            }
          })

          queue.process('email-reminder', (job,done) => {
            console.log(job.data);
            mailer(job.data.email)
            })
        })
        .catch(function(err) {
          console.log(err)
        })
    });
  }
}
