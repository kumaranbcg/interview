const { NotificationSentLog, Alert, Detection, User } = require("../db");

module.exports = {
  saveLog: async (user_id, alert_id, detection_id, output_address, output_detail, output_type) => {
    try {
      if (alert_id) {
        const alert = await Alert.findOne({
          where: {
            id: alert_id
          }
        });
        if (!alert) {
          throw {
            success: false,
            message: "Alert doestn't exists"
          }
        }
      }
      const notificationSentLog = await NotificationSentLog.create({
        user_id, alert_id, detection_id, output_address, output_detail, output_type
      })
      return notificationSentLog.id;
    } catch (err) {
      console.log(err);
      return null
    }
  }
}