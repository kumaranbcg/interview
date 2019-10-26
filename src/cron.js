const CronJob = require("cron").CronJob;
const daily = require("./lib/daily");
new CronJob(
  "0 0 0-23 * * *",
  async () => {
    try {
      doJob();
    } catch (err) {}
  },
  null,
  true,
  "Asia/Hong_Kong"
);

async function doJob() {
  const alerts = await daily.getAlerts();
  alerts.forEach(alert => {
    const noHelmetCount = alert.monitor.detections.reduce(
      (sum, detection) =>
        sum + detection.result.filter(result => result === "N").length,
      0
    );
    const data = {
      noHelmetCount
    };
    email.send({
      template: "daily",
      data,
      monitor,
      url: `https://app.viact.ai/#/report/${alert.monitor.id}/daily`
    });
  });
}

doJob();
