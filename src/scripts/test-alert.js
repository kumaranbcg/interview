const alert = require("../lib/alert");

alert.do(
  [
    {
      id: "4df8a824-f5d4-4004-a7af-89fb9da3e05f",
      engine: "dump-truck",
      interval: 0,
      output_type: "SMS",
      // output_address:
      //   "gary.ng@customindz.com,harry.ng@dixlpm.com.hk,buildmindht@outlook.com,izaac.leung@customindz.com,hc@botzup.com,jurge92@icloud.com,zq.donald.chong@gmail.com",
      // output_address: "buildmindht@outlook.com",
      //output_address:"zq.donald.chong@gmail.com,donaldz0728@gmail.com",
      output_address:"+8613682664411,+85259231994",
      trigger_record: false,
      alert_type: "Trigger",
      created_at: "2020-02-17 12:00",
      updatedAt: "2019-09-17T12:22:30.000Z",
      monitor_id: "tuspark-roof",
      monitor:{
        name: "HHDT1"
      }
    }
  ],
  {
    image: `https://windht.github.io/customindz-front-end-react-app/static/media/new_logo.a27f7193.png`,
    url: "http://hhdt1.viact.ai/#/user/alert-detail/24bb3dbc-f172-488c-b04e-f0c2319b799b",
    title: "Daily Report",
    subtitle: "Check the daily report"
  }
);
