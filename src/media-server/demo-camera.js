const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs-extra");
const draw = require("./lib/draw");
const { transferFrames } = require("./frame");
const id = "local";
const frameDir = `frames/${id}`;
fs.ensureDirSync(frameDir);
function create() {
  let lastFrameEnqueued = 0;
  let ffmpegProcess = ffmpeg("video=HD Webcam")
    .inputOptions("-f dshow")
    .on("start", function(commandLine) {
      console.log("Spawned Ffmpeg with command: " + commandLine);
    })
    .on("progress", function(progress) {
      lastFrameEnqueued += 1;
      console.log(lastFrameEnqueued);
      enqueueFrame(lastFrameEnqueued);
    })
    .on("error", err => {
      console.log(err.message);
      if (err.message.indexOf("SIGKILL") === -1) {
        console.log("Stream for " + id + " is in error");
        console.log("Recreating in 1s");
        setTimeout(() => {
          create();
        }, 1000);
      } else {
        console.log("Stream for " + id + " is killed");
      }
    })
    .on("end", function() {
      console.log("Finished processing");
      console.log("Recreating in 1s");
      setTimeout(() => {
        create();
      }, 1000);
    })
    .output(`${frameDir}/frame.jpg`)
    .fps(30)
    .size("640x360")
    .outputOptions(["-vf fps=1", "-update 1"]);
  ffmpegProcess.run();
}

async function enqueueFrame(number) {
  // do something with frame<number>.jpg
  try {
    if (number % 1 === 0) {
      const data = await fs.readFile(`${frameDir}/frame.jpg`);
      const detection = await transferFrames(
        {
          id: "local",
          engines: ["customindz"]
        },
        data
      );
      // console.log(detection);
      // console.log("Detection Result Get, Start drawing");
      await draw.rects(`${frameDir}/frame.jpg`, detection);
    } else {
    }
    //
  } catch (err) {
    console.log(err.message);
  }
}

create();
