const nodemailer = require("nodemailer");
const moment = require("moment");
const Email = require("email-templates");
// rcnnyolom2detcenternet@gmail.com,gary.ng@customindz.com,harry.ng@dixlpm.com.hk,buildmindht@outlook.com,izaac.leung@customindz.com,hc@botzup.com,jurge92@icloud.com,zq.donald.chong@gmail.com
const EMAIL_USER = "viact@hotmail.com";
const EMAIL_PASSWORD = "GaryNg123";
const transporter = nodemailer.createTransport({
  service: "Hotmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

const email = new Email({
  message: {
    from: `Viact Official<${EMAIL_USER}>`
  },
  transport: transporter,
  send: true,
  preview: false
});

module.exports = {
  send: ({ template, alert, ...rest }) => {
    return email.send({
      template,
      message: {
        from: EMAIL_USER,
        to: alert.output_address
      },
      locals: {
        alert,
        timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
        ...rest
      }
    });
  }
};
