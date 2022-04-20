const nodemailer = require('nodemailer');
const config = require('../../../config/config');
const smtpTransport = require('nodemailer-smtp-transport');

const send = async (mail) => {
  // console.log({mail});
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 25,
    ignoreTLS: false,
    secure: false,
    auth: {
      user: config.mail.MAIL_SMTP_USER,
      pass: config.mail.MAIL_SMTP_PASSWORD,
    },
  });

  let options = {
    from: config.mail.MAIL_FROM,
    to: mail.to,
    subject: mail.subject,
    html: mail.html,
  };

  if (mail.cc) {
    options.cc = mail.cc;
  }

  if (mail.replyTo) {
    options.replyTo = mail.replyTo;
  }

  transporter.sendMail(options);
};

module.exports = {
  send,
};
