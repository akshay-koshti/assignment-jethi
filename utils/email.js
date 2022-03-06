const nodemailer = require('nodemailer');

const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'test@gmail.com',
    pass: '1234567890'
  }
});

module.exports = (sendTo, subject, text) => {
  const mailDetails = {
    from: 'tarunkoshti122@gmail.com',
    to: sendTo,
    subject: subject,
    text: text
  };

  mailTransporter.sendMail(mailDetails, (err, data) => {
    if (err) {
      console.log(err);
    }
  });
}
