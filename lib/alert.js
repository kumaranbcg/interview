const ses = require("./ses");
const moment = require("moment");
module.exports = {
  alert: alert => {
    if (alert.output_type === "email") {
      return ses.send({
        email: alert.output_address,
        subject: "New Alert From Monitor",
        body: `You have a new alert in monitor <b>${
          alert.monitor.name
        }</b> triggering the engine <b>${alert.engine}</b> at <b>${moment(
          alert.createdAt
        ).format("dddd, MMMM Do YYYY, h:mm:ss a")}</b>.`
      });
    }
    return false;
  }
};
