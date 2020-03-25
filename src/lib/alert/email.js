const nodemailer = require("nodemailer");
const moment = require("moment");
const Email = require("email-templates");
const path = require("path");
const axios = require('axios')
const savelogs = require("../../api/savelog")
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

module.exports = {
  send: ({ template, alert, ...rest }) => {
    console.log(alert.output_address)
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
        .then(async ()=>{
          let body = {
            alert_id : alert.id,
            detection_id :"fe9fcabf-1f3a-4631-a9d8-4f7e6103487c",
            user_id:"b5a3fc33-deec-4509-9f0d-72be1ca877b6",
            output_address:address,
            output_detail : 'Send Success',
            output_type : alert.output_type
          }
          await savelogs.save(body)
        })
        .catch(async (err)=>{
          let body = {
            alert_id : alert.id,
            detection_id :"fe9fcabf-1f3a-4631-a9d8-4f7e6103487c",
            user_id:"b5a3fc33-deec-4509-9f0d-72be1ca877b6",
            output_address:address,
            output_detail : 'Send Failed',
            output_type : alert.output_type
          }
          await savelogs.save(body)
        });
    });
  }
};
