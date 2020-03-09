const dingtalk = require("./dingtalk");
const email = require("./email");
const sms = require("./sms")
const { USER_POOL, cognitoidentityserviceprovider } = require('../cognito')

var params = {
  UserPoolId: USER_POOL
};


module.exports = {
  do: ({ image, url }, alert) => {

    cognitoidentityserviceprovider.listUsers(params, (err, data) => {
      data.Users.forEach(user => {
        let notification_type;
        let emailValue;
        let phone;

        user['Attributes'].forEach(obj => {
          if (obj.Name === 'custom:notification_type') {
            notification_type = obj.Value
          }
          if (obj.Name === 'custom:phone') {
            phone = obj.Value
          }
          if (obj.Name === 'email') {
            emailValue = obj.Value
          }
        });
        if (notification_type) {
          try {
            const config = JSON.parse(notification_type);
            if (config.email && emailValue) {
              console.log('email sent', config.email, emailValue)
              email.send({
                template: "alert",
                alert,
                addresses: [emailValue],
                image,
                url
              });
            }

            if (config.sms && phone) {
              console.log('phone sent', config.sms, phone)
              sms.send({
                alert,
                url,
                phones: [phone]
              });
            }
          } catch (error) {
            console.error(error.message);
          }

        }

      });
    });
  }
}