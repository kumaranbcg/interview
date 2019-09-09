const bot_url =
  "https://oapi.dingtalk.com/robot/send?access_token=b6f622807e5ac5033bee4baab3765117d6bed24959b9f0fc35d8730f24ed12c8";

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
