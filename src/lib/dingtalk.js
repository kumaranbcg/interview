module.exports = {
  send: ({ message, token }) => {
    return axios.post(
      `https://oapi.dingtalk.com/robot/send?access_token=${token}`,
      {
        msgtype: "text",
        text: {
          content: message
        }
      }
    );
  }
};
