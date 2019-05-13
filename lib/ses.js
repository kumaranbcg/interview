const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  // QQ Mail Testing Check https://www.ctolib.com/topics-114298.html
  service: "qq",
  port: 465,
  auth: {
    user: "******@qq.com",
    pass: "****************"
  }
});

module.exports = {
  send: (email, subject, body) => {
    return new Promise((resolve, reject) => {
      // Main code
      let mailOptions = {
        from: "kasora<******@qq.com>", // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: body // html body
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
