const dingtalk = require("./dingtalk");
const email = require("./email");
const sms = require("./sms");
const { USER_POOL, cognitoidentityserviceprovider } = require("../cognito");
const { Company, NotificationSentLog } = require("../db");
const { Op } = require("sequelize");
const moment = require("moment");

var params = {
  UserPoolId: USER_POOL
};

module.exports = {
  do: ({ image, url }, alert) => {
    return new Promise((resolve, reject) => {
      let smsCount = 0;
      let emailCount = 0;

      cognitoidentityserviceprovider.listUsers(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        data.Users.forEach(async user => {
          let notification_type,
            emailValue,
            phone,
            company,
            logs,
            company_code,
            username,
            smsLogsCount = 0,
            emailLogsCount = 0,
            sms_frequency = 5,
            email_frequency = 8,
            sms_sent = 0,
            email_sent = 0;

          user["Attributes"].forEach(obj => {
            if (obj.Name === "custom:notification_type") {
              notification_type = obj.Value;
            }
            if (obj.Name === "custom:phone") {
              phone = obj.Value;
            }
            if (obj.Name === "email") {
              emailValue = obj.Value;
            }
            if (obj.Name === "username") {
              username = obj.Value;
            }
            if (obj.Name === "custom:company_code") {
              company_code = obj.Value;
            }
          });
          if (company_code) {
            try {
              company = await Company.findOne({
                where: {
                  company_code: company_code
                }
              });
              logs = await NotificationSentLog.findAll({
                where: {
                  user_id: company_code,
                  created_at: {
                    [Op.between]: [
                      moment().format("YYYY-MM-DD HH:00:00"),
                      moment()
                        .add(1, "hour")
                        .format("YYYY-MM-DD HH:00:00")
                    ]
                  }
                }
              });
            } catch (err) {
              console.log(err);
            }
          } else {
            try {
              logs = await NotificationSentLog.findAll({
                where: {
                  user_id: "undefined",
                  created_at: {
                    [Op.between]: [
                      moment().format("YYYY-MM-DD HH:00:00"),
                      moment()
                        .add(1, "hour")
                        .format("YYYY-MM-DD HH:00:00")
                    ]
                  }
                }
              });
            } catch (err) {
              console.log(err);
            }
          }

          if (company) {
            let data = company.dataValues;
            sms_frequency = data.sms_frequency;
            email_frequency = data.email_frequency;
          }

          if (logs) {
            logs.forEach(sentLog => {
              const log = sentLog.dataValues;
              if (log.output_type === "email") emailLogsCount += 1;
              else smsLogsCount += 1;
            });
          }

          if (notification_type) {
            try {
              const config = JSON.parse(notification_type);
              if (
                config.email &&
                emailValue &&
                emailLogsCount < email_frequency
              ) {
                emailCount += 1;
                email.send({
                  template: "alert",
                  alert,
                  addresses: [emailValue],
                  image,
                  company_code: company_code || "undefined",
                  url
                });
              }

              if (config.sms && phone && smsLogsCount < sms_frequency) {
                smsCount += 1;
                sms.send({
                  alert,
                  url,
                  phones: [phone],
                  company_code: company_code || "undefined"
                });
              }
            } catch (error) {
              reject(error);
            }
          }
        });
        resolve({
          emailCount,
          smsCount
        });
      });
    });
  }
};
