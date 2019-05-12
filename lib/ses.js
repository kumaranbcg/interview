const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  // QQ Mail Testing Check https://www.ctolib.com/topics-114298.html
});

module.exports = {
  send: (email, subject, body) => {
    return new Promise((resolve, reject) => {
      // Main code
      let mailOptions = {};

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return reject(error);
        }
        resolve(info);
      });
    });
  }
};
