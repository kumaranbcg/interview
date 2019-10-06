const dingtalk = require("./dingtalk");

module.exports = {
  do: (alerts, { image, url, title, subtitle }) => {
    alerts.forEach(alert => {
      if (alert.alert_type === "Interval") {
        return;
      }
      if (alert.output_type === "Dingtalk") {
        dingtalk.send({
          message:
            subtitle ||
            `The alert is triggered by engine ${alert.engine} in monitor ${alert.monitor_id}`,
          token: alert.output_address,
          image,
          url,
          title
        });
      }
    });
  }
};
