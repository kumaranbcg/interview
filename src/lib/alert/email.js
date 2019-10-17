const nodemailer = require("nodemailer");

const EMAIL_USER = "viact@hotmail.com";
const EMAIL_PASSWORD = "GaryNg123";
const transporter = nodemailer.createTransport({
  // QQ Mail Testing Check https://www.ctolib.com/topics-114298.html
  service: "Hotmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

module.exports = {
  send: ({ message, address, image, url, title }) => {
    return new Promise((resolve, reject) => {
      // Main code
      let mailOptions = {
        from: `Viact Official<${EMAIL_USER}>`, // sender address
        to: address, // list of receivers
        subject: title, // Subject line
        html: `${message} <a href="${url}">here</a></br><img src="${image}"/>` // html body
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return reject(error);
        }
        resolve(info);
      });
    });
  }
};
