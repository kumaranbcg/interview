const ses = require("./ses");
const dingtalk = require("./dingtalk");
const moment = require("moment");
module.exports = {
  alert: alert => {
    const message = `You have a new alert in monitor <b>${
      alert.monitor.name
    }</b> triggering the engine <b>${alert.engine}</b> at <b>${moment().format(
      "dddd, MMMM Do YYYY, h:mm:ss a"
    )}</b>.`;

    if (alert.output_type === "email") {
      return ses.send({
        email: alert.output_address,
        subject: "New Alert From Monitor",
        body: message
      });
    }
    if (alert.output_type === "dingtalk") {
      return dingtalk.send({ message, token: alert.output_address });
    }
    return false;
  }
};
