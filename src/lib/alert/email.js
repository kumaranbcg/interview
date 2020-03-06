const nodemailer = require("nodemailer");
const moment = require("moment");
const Email = require("email-templates");
const path = require("path");
// const EMAIL_USER = "info@viact.ai";
// const EMAIL_PASSWORD = "SKrKRcGKeGGpDDD";
const EMAIL_USER = "viact";
const EMAIL_PASSWORD = "Rd4W78*JsyC2n*X";
const transporter = nodemailer.createTransport({
  service: "SendGrid", // no need to set host or port etc.
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
    ["zq.donald.chong@gmail.com","Joergen@viact.ai"].split(",").forEach(address => {
    //alert.output_address.split(",").forEach(address => {
      return email
        .send({
          template,
          message: {
            from: 'info@viact.ai',
            to:address
          },
          locals: {
            alert,
            timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
            ...rest
          }
        })
        .then(console.log)
        .catch(console.error);
    });
  }
};
