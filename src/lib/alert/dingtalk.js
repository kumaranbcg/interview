const axios = require("axios");
module.exports = {
  send: ({ message, token, image, url, title }) => {
    // console.log(message, token, image, url);
    return axios.post(
      `https://oapi.dingtalk.com/robot/send?access_token=${token}`,
      // {
      //   msgtype: "markdown",
      //   markdown: {
      //     title: "New Alert",
      //     text: "#### You have a new alert > ${message} > ![screenshot](${image})"
      //   }
      // }
      {
        msgtype: "link",
        link: {
          text: message,
          title: title || "New Alert",
          picUrl: image,
          messageUrl: url
        }
      }
    );
  }
};
