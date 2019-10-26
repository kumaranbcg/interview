const email = require("../lib/alert/email");

const alert = {
  alert_type: "Trigger",
  createdAt: "2019-09-17T12:21:55.000Z",
  engine: "Helmet",
  id: "4df8a824-f5d4-4004-a7af-89fb9da3e05f",
  interval: 0,
  monitor: {
    name: "Viact Construction"
  },
  monitor_id: "tuspark",
  output_address: "buildmindht@outlook.com",
  output_type: "Dingtalk",
  trigger_record: false,
  updatedAt: "2019-09-17T12:22:30.000Z"
};

const image =
  "https://customindz-shinobi.s3-ap-southeast-1.amazonaws.com/frames/tuspark/latest.jpg?1572113906518";
const title = "Test";
const url = `http://app.viact.ai/#/report/tuspark-roof/detection/xx-xx`;

email
  .send({
    template: "alert",
    alert,
    address: alert.output_address,
    image,
    url,
    title
  })
  .then(data => console.log("Success") && console.log(data))
  .catch(console.err);
