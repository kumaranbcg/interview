const { NotificationSentLog, Alert, Detection, User } = require("./db");

module.exports = {
  saveLog: async ({alert_id, detection_id, user_id, output_address, output_detail, output_type}) => {
    try {
      // validate alert
      if (alert_id) {
        const alert = await Alert.findOne({where: {id: alert_id}});
        if (!alert) {
          throw new Error("Alert is invalid");
        }
      }

      // validate detection
      if (detection_id) {
        const detection = await Detection.findOne({where: {id: detection_id}});
        if (!detection) {
          throw new Error("Detection is invalid");
        }
      }

      // validate user
      if (user_id) {
        const user = await User.findOne({where: {id: user_id}});
        if (!user) {
          throw new Error("User is invalid");
        }
      }

      // save log
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