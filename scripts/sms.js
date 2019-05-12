const sms = require("../lib/sms");

sms
  .send("testText", "testPhone")
  .then(() => {
    console.log("Success");
  })
  .catch(err => {
    console.log(err);
  });
