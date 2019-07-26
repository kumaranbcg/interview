const axios = require("axios");
const path = require("path");
// const detectionModelPath = "../ssd_mobilenet_v2_coco";
// const pbFile = path.resolve(
//   __dirname,
//   detectionModelPath,
//   "frozen_inference_graph.pb"
// );
// const pbtxtFile = path.resolve(
//   __dirname,
//   detectionModelPath,
//   "ssd_mobilenet_v2_coco_2018_03_29.pbtxt"
// );

const ssdcocoModelPath = "../ssd_300x300";

const prototxt = path.resolve(__dirname, ssdcocoModelPath, "deploy.prototxt");
const modelFile = path.resolve(
  __dirname,
  ssdcocoModelPath,
  "VGG_coco_SSD_300x300_iter_400000.caffemodel"
);
const net = cv.readNetFromCaffe(prototxt, modelFile);

module.exports = {
  handle: async (monitor, base64) => {
    try {
      const pngPrefix = "data:image/jpeg;base64,";
      const jpgPrefix = "data:image/png;base64,";
      const base64Data = base64.replace(pngPrefix, "").replace(jpgPrefix, "");
      const buffer = Buffer.from(base64Data, "base64");
      const img = cv.imdecode(buffer);
      const imgResized = img.resize(300, 300);
      const inputBlob = cv.blobFromImage(imgResized);
      net.setInput(inputBlob);
      let outputBlob = net.forward();
      outputBlob = outputBlob.flattenFloat(
        outputBlob.sizes[2],
        outputBlob.sizes[3]
      );

      const results = extractResults(outputBlob, img).map(r =>
        Object.assign({}, r, { className: classNames[r.classLabel] })
      );

      // const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
      // const detection = classifier.detectMultiScale(img.bgrToGray());
      console.log("Detection");
      console.log(results);

      // const people_info = JSON.parse(JSON.parse(data).response[0].people_info);
      // for (let id in people_info) {
      //   let people = people_info[id];
      //   result.push({
      //     left: people.location[0] * 2,
      //     top: people.location[1] * 2,
      //     width: (people.location[2] - people.location[0]) * 2,
      //     height: (people.location[3] - people.location[1]) * 2,
      //     action: people.action
      //   });
      // }

      return [];
    } catch (err) {
      return [];
    }
  }
};

function extractResults(outputBlob, imgDimensions) {
  return Array(outputBlob.rows)
    .fill(0)
    .map((res, i) => {
      const classLabel = outputBlob.at(i, 1);
      const confidence = outputBlob.at(i, 2);
      const bottomLeft = new cv.Point(
        outputBlob.at(i, 3) * imgDimensions.cols,
        outputBlob.at(i, 6) * imgDimensions.rows
      );
      const topRight = new cv.Point(
        outputBlob.at(i, 5) * imgDimensions.cols,
        outputBlob.at(i, 4) * imgDimensions.rows
      );
      const rect = new cv.Rect(
        bottomLeft.x,
        topRight.y,
        topRight.x - bottomLeft.x,
        bottomLeft.y - topRight.y
      );

      return {
        classLabel,
        confidence,
        rect
      };
    });
}
