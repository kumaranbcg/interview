const axios = require("axios");

module.exports = {
  handle: async (monitor, base64) => {
    try {
      const { data } = await axios.post(
        "http://ec2-18-188-230-84.us-east-2.compute.amazonaws.com:5000/new_frame"
      );

      let result = [];
      const people_info = JSON.parse(JSON.parse(data).response[0].people_info);
      for (let id in people_info) {
        let people = people_info[id];
        result.push({
          left: people.location[0] * 2,
          top: people.location[1] * 2,
          width: (people.location[2] - people.location[0]) * 2,
          height: (people.location[3] - people.location[1]) * 2,
          action: people.action
        });
      }

      return result;
    } catch (err) {
      return [];
    }
  }
};
