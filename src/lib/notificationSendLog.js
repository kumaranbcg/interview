const { NotificationSentLog } = require("./db");

module.exports = {
  saveLog: async ({alert_id, detection_id, user_id, output_address, output_detail, output_type}) => {
    try {
      await NotificationSentLog.create({
        alert_id,
        detection_id,
        user_id,
        output_address,
        output_detail,
        output_type,
      });
      console.log("Successfully Save Notification Sent Log");
    } catch(err) {
      console.log(err);
    }
  }
};