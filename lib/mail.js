var Mailer    = require('nodemailer');

module.exports.send = function send(title, message) {
  var transporter;

  transporter = Mailer.createTransport({
      service: 'MailGun'
    , auth: {
        user: process.env.MG_ACCOUNT
      , pass: process.env.MG_PW
      }
  });

  transporter.sendMail({
      from    : 'Grim Giveaway'
    , to      : 'nick@grim-giveaway.com'
    , subject : title
    , text    : message
  });
}
