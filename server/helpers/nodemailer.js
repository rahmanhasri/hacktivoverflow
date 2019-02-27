var nodemailer = require("nodemailer");

function mailNotifications(targetEmail) {

  var smtpTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
          user: "underflowmaman@gmail.com",
          pass: 'Kicksome4ss.'
      }
  });
  
  var mailOptions = {
      from: "underflowmaman@gmail.com", // sender address
      to: targetEmail, // list of receivers
      subject: `underflow reminder`, // Subject line
      text: `WHY DONT YOU ACTIVE AT OUR WEB?`, // plaintext body
      // html: `<b>Click <a href="${urlLink}">here</a> to see the post. ✔</b>` // html body
  }
  
  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
          console.log(error);
      } else{
          console.log(response)
          console.log("Message sent... ✔", targetEmail);
      }
  
      // if you don't want to use this transport object anymore, uncomment following line
      //smtpTransport.close(); // shut down the connection pool, no more messages
  });
}

module.exports = mailNotifications
