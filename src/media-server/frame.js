const faceplusplus = require("./lib/faceplusplus");
const customindz = require("./lib/customindz");
const axios = require("axios");

module.exports = {
  transferFrames: async (monitor, data) => {
    // const slimmedData = await sharp(data).resize(640, 360).toBuffer;
    const base64 = data.toString("base64");
    let detections = [];
    if (monitor.engines) {
      if (monitor.engines.indexOf("faceplusplus") !== -1) {
        const faceplusplusData = await faceplusplus.detect(base64);
        detections = detections.concat(faceplusplusData);
      }

      if (monitor.engines.indexOf("baidu") !== -1) {
        const baiduData = await client.advancedGeneral(base64);
        detections = detections.concat(baiduData);
      }

      if (monitor.engines.indexOf("mock") !== -1) {
        const mockData = [];
        const numberOfPeople = Math.floor(Math.random() * 6 + 1);
        for (let i = 0; i < numberOfPeople; i++) {
          mockData.push({
            left: Math.floor(Math.random() * 640),
            top: Math.floor(Math.random() * 360),
            width: 100,
            height: 100
          });
        }
        detections = detections.concat(mockData);
      }

      if (monitor.engines.indexOf("customindz") !== -1) {
        const customindzData = await customindz.handle(monitor, base64);
        detections = detections.concat(customindzData);
      }
    }

    if (detections.length > 0) {
      let alert = false;
      detections.forEach(detection => {
        if (detection.action === 1) {
          alert = true;
        }
      });

      axios
        .post(
          "https://api.customindz.com/api/admin/detection",
          {
            engine: "customindz",
            monitor_id: monitor.id,
            result: detections,
            alert
          },
          {
            headers: {
              "x-customindz-key": "customindz"
            }
          }
        )
        .then(response => {
          // console.log(response.data);
        })
        .catch(err => {
          // console.log(err);
        });
    }

    return detections;
  }
};
