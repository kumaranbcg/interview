//var dotenv = require("dotenv");
const axios = require("axios");
//dotenv.config({ path: "../../../.env" });

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = "AC3374d3a92b109427519a0eb01435806f";
const authToken = "6f05338cdc990f3ee3de7b0e23a27eff";
const client = require("twilio")(accountSid, authToken);


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

      saveLog(alert);

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
        .then(message => console.log(message.sid));
    });
    return;
  }
};
