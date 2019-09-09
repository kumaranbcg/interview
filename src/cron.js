const CronJob = require("cron").CronJob;
const Alert = require("../models/alert");

new CronJob(
  "0 0 0-23 * * *",
  async () => {
    try {
      const alerts = await Alert.find({
        where: {
          type: "interval",
          interval: new Date().getHours()
        }
      });

      alerts.forEach(alert => {});
    } catch (err) {}
  },
  null,
  true,
  "Asia/Hong_Kong"
);
