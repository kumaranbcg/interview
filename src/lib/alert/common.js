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
      if (user_id) {
        const user = await User.findOne({
          where: {
            id: user_id
          }
        });
        if (!user) {
          throw {
            success: false,
            message: "User doestn't exists"
          }
        }
      }
      if (detection_id) {
        const detection = await Detection.findOne({
          where: {
            id: body.detection_id
          }
        });
        if (!detection) {
          throw {
            success: false,
            message: "Detection doestn't exists"
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