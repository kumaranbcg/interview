const AWS = require("./AWS");

module.exports = {
  send: (text, phone) => {
    const params = {
      Message: text /* required */,
      PhoneNumber: phone // 'E.164_PHONE_NUMBER' Check https://www.twilio.com/docs/glossary/what-e164
    };
    return new AWS.SNS({ apiVersion: "2010-03-31" })
      .setSMSAttributes(params)
      .promise(); // Returns promise directly
  }
};
