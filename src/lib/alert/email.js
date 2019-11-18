const nodemailer = require("nodemailer");
const moment = require("moment");
const Email = require("email-templates");
// rcnnyolom2detcenternet@gmail.com,gary.ng@customindz.com,harry.ng@dixlpm.com.hk,buildmindht@outlook.com,izaac.leung@customindz.com,hc@botzup.com,jurge92@icloud.com,zq.donald.chong@gmail.com
const EMAIL_USER = "info@viact.ai";
const EMAIL_PASSWORD = "SKrKRcGKeGGpDDD";
const transporter = nodemailer.createTransport({
  service: "SendPulse", // no need to set host or port etc.
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
