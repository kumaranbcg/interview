const alert = require("../lib/alert");

// alert.do(
//   [
//     {
//       id: "8b8901b2-b58d-4823-8bd1-a88f0d2b0f79",
//       engine: "dump-truck",
//       interval: 0,
//       output_type: "Email",
//       // output_address:
//       //   "gary.ng@customindz.com,harry.ng@dixlpm.com.hk,buildmindht@outlook.com,izaac.leung@customindz.com,hc@botzup.com,jurge92@icloud.com,zq.donald.chong@gmail.com",
//       // output_address: "buildmindht@outlook.com",
//       output_address:"zq.donald.chong@gmail.com,Joergen@viact.ai",
//       trigger_record: false,
//       alert_type: "Trigger",
//       created_at: "2020-03-13 18:37:13",
//       updatedAt: "2020-03-03T18:37:13.000Z",
//       monitor_id: "tuspark-roof",
//       monitor:{
//         name: "HHDT1"
//       }
//     }
//   ],
//   {
//     image: `https://windht.github.io/customindz-front-end-react-app/static/media/new_logo.a27f7193.png`,
//     url: "http://http://hhdt1.viact.ai/#/user/alert-detail/8b8901b2-b58d-4823-8bd1-a88f0d2b0f79",
//     title: "Alert for HHDT1",
//     subtitle: "Check the alert"
//   }
// );

alert.do(
  [
    {
      id: "8b8901b2-b58d-4823-8bd1-a88f0d2b0f79",
      engine: "dump-truck",
      interval: 0,
      output_type: "SMS",
      // output_address:
      //   "gary.ng@customindz.com,harry.ng@dixlpm.com.hk,buildmindht@outlook.com,izaac.leung@customindz.com,hc@botzup.com,jurge92@icloud.com,zq.donald.chong@gmail.com",
      // output_address: "buildmindht@outlook.com",
      output_address:"+85259231994",
      trigger_record: false,
      alert_type: "Trigger",
      created_at: "2020-03-13 18:37:13",
      updatedAt: "2020-03-03T18:37:13.000Z",
      monitor_id: "tuspark-roof",
      monitor:{
        name: "HHDT1"
      }
    }
  ],
  {
    image: `https://windht.github.io/customindz-front-end-react-app/static/media/new_logo.a27f7193.png`,
    url: "http://http://hhdt1.viact.ai/#/user/alert-detail/8b8901b2-b58d-4823-8bd1-a88f0d2b0f79",
    title: "Alert for HHDT1",
    subtitle: "Check the alert"
  }
);
