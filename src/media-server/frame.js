// const customindz = require("./lib/customindz");
const axios = require("axios");

module.exports = {
  transferFrames: async (monitor, data) => {
    // const slimmedData = await sharp(data).resize(640, 360).toBuffer;
    const base64 = data.toString("base64");
    let detections = [];
    // if (monitor.engines) {
    // if (monitor.engines.indexOf("customindz") !== -1) {
    // const customindzData = await customindz.handle(monitor, base64);
    // detections = detections.concat(customindzData);
    // }
    // }

    if (detections.length > 0) {
      let alert = false;
      detections.forEach(detection => {
        if (detection.action === 1) {
          alert = true;
        }
      });

      axios
        .post(
          "http://localhost:5000/api/admin/detection",
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
