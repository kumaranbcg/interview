const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs-extra");
module.exports = {
  rects: (path, rects) => {
    return new Promise((resolve, reject) => {
      const videoFilters = rects.map(
        ({ left, top, width, height, action }) => ({
          filter: "drawbox",
          options: [left, top, width, height, action ? "red@0.5" : "blue@0.5"]
        })
      );

      if (videoFilters.length === 0) {
        fs.copy(path, path.replace(".jpg", "-detection.jpg"), err => {
          if (!err) {
            resolve();
          }
        });
      } else {
        ffmpeg(path)
          .on("error", err => {
            // console.log(err);
            // reject(err);
          })
          .on("end", () => {
            resolve();
          })
          .videoFilters(videoFilters)
          .output(path.replace(".jpg", "-detection.jpg"))
          .run();
      }
    });
  }
};
