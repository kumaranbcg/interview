var dotenv = require("dotenv");
const axios = require("axios");
const savelogs = require("../../api/savelog")
//dotenv.config({ path: "../../../.env" });

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = "AC3374d3a92b109427519a0eb01435806f";
const authToken = "6f05338cdc990f3ee3de7b0e23a27eff";
const client = require("twilio")(accountSid, authToken);

module.exports = {
  send: async ({ alert, url }) => {
    let detectionType = "";
    switch (alert.engine) {
      case "helmet":
        detectionType = "Helmet Detection";
        break;
      case "face-detection":
        detectionType = "Face Detection";
        break;
      case "danger-zone":
        detectionType = "Danger Zone";
        break;
      case "dump-truck":
        detectionType = "Dump truck";
        break;
    }
    let shortenUrl;
    await axios({
      url: "https://api-ssl.bitly.com/v4/shorten",
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 7ed758d757b43dc62d9e0a7b211b4a5a46e1239f"
      },
      data: JSON.stringify({
        group_guid: "Bk2ifLhmdp7",
        domain: "bit.ly",
        long_url: url
      })
    })
      .then(response => {
        shortenUrl = response.data.link;
      })
      .catch(function(error) {
        console.log("Post Error : " + error);
      });
    //let phoneNumber = "+852" + alert.output_address;
    let message =
      detectionType +
      " alert detected at " +
      alert.created_at +
      ". Login to Viact for details: " +
      (shortenUrl ? shortenUrl : url);
    alert.output_address.split(",").forEach(number => {
      client.messages
        .create({
          body: message,
          from: "+13526334065",
          to: number
        })
        .then(async (message) => {
          console.log(message.sid)
          let body = {
            alert_id : alert.id,
            detection_id :"fe9fcabf-1f3a-4631-a9d8-4f7e6103487c",
            user_id:"b5a3fc33-deec-4509-9f0d-72be1ca877b6",
            output_address:alert.output_address,
            output_detail : 'Send Success '+message.sid,
            output_type : alert.output_type
          }
          await savelogs.save(body)
        }).catch(async ()=>{
          let body = {
            alert_id : alert.id,
            detection_id :"fe9fcabf-1f3a-4631-a9d8-4f7e6103487c",
            user_id:"b5a3fc33-deec-4509-9f0d-72be1ca877b6",
            output_address:alert.output_address,
            output_detail : 'Send Failed',
            output_type : alert.output_type
          }
          await savelogs.save(body)
        });
    });
    return;
  }
};
