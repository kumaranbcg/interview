const alert = require("../lib/alert");

alert.do(
  [
    {
      id: "4df8a824-f5d4-4004-a7af-89fb9da3e05f",
      engine: "Helmet",
      interval: 0,
      output_type: "Email",
      output_address:
        "gary.ng@customindz.com,buildmindht@outlook.com,izaac.leung@customindz.com,hc@botzup.com,jurge92@icloud.com,zq.donald.chong@gmail.com",
      // output_address: "buildmindht@outlook.com",
      trigger_record: false,
      alert_type: "Trigger",
      createdAt: "2019-09-17T12:21:55.000Z",
      updatedAt: "2019-09-17T12:22:30.000Z",
      monitor_id: "tuspark-roof"
    }
  ],
  {
    image: `https://windht.github.io/customindz-front-end-react-app/static/media/new_logo.a27f7193.png`,
    url: `https://windht.github.io/customindz-front-end-react-app/#/report/tuspark-roof/daily`,
    title: "Daily Report",
    subtitle: "Check the daily report"
  }
);
