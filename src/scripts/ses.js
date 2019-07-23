const ses = require("../lib/ses");

ses
  .send("testEmailAddress", "testSubject", "testBody")
  .then(() => {
    console.log("Successfully send ses");
  })
  .catch(err => {
    console.log(err);
  });
