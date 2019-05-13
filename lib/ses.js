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
        to: "kasorasun@gmail.com", // list of receivers
        subject: "Hello", // Subject line
        text: "what can i do ?", // plain text body
        html: '<a href="kasora.moe">click here</a>' // html body
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
