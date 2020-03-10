const nodemailer = require("nodemailer");
const moment = require("moment");
const axios = require("axios");
const Email = require("email-templates");
const path = require("path");
// rcnnyolom2detcenternet@gmail.com,gary.ng@customindz.com,harry.ng@dixlpm.com.hk,buildmindht@outlook.com,izaac.leung@customindz.com,hc@botzup.com,jurge92@icloud.com,zq.donald.chong@gmail.com
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

saveLog = async (req) => {
    await axios({
      url: "http://localhost:3000/api/notification-sent-logs",
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        alert_id: req.id,
        detection_id: req.detection_id || "fe9fcabf-1f3a-4631-a9d8-4f7e6103487c",
        user_id: req.user_id || "b5a3fc33-deec-4509-9f0d-72be1ca877b6",
        output_address: req.output_address,
        output_detail: req.output_detail || "test detail",
        output_type: req.output_type,
        created_at: req.created_at,
        updated_at: req.updatedAt
      })
    })
      .then(response => {
        res = response.data;
      })
      .catch(function (error) {
        console.log("Post Error : " + error);
      });
}

module.exports = {
  send: ({ template, alert, ...rest }) => {
    alert.output_address.split(",").forEach(address => {
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
    saveLog(alert);

  }
};
