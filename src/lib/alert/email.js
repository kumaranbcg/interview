const nodemailer = require("nodemailer");
const Email = require("email-templates");
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
  transport: transporter
});

module.exports = {
  send: ({ template, alert, ...rest }) => {
    console.log(template);
    return email.send({
      template,
      message: {
        to: alert.output_address
      },
      locals: {
        alert,
        ...rest
      }
    });
  }
};
