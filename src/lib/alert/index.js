const dingtalk = require("./dingtalk");
const email = require("./email");
const sms = require("./sms")
module.exports = {
  do: (alerts, { image, url }) => {
    alerts.forEach(alert => {
      if (alert.alert_type === "Interval") {
        return;
      }
      if (alert.output_type === "Dingtalk") {
        dingtalk.send({
          message: `The alert is triggered by engine ${alert.engine} in monitor ${alert.monitor_id}`,
          token: alert.output_address,
          image,
          url
        });
      }

      if (alert.output_type === "Email") {
        email.send({
          template: "alert",
          alert,
          image,
          url
        });
      }

      if (alert.output_type === "SMS") {
        sms.send({
          alert,
          url
        });
      }
    });
  }
};
