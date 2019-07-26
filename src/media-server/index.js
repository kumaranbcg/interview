const stream = require("./stream");
const axios = require("axios");
const Monitor = require("../models/monitor");

async function run() {
  const data = await Monitor.findAll();
  data.forEach((monitor, index) => {
    if (stream.get(monitor.id)) {
      if (stream.get(monitor.id).url === monitor.connection_uri) {
        // console.log("Resetting monitor info");
        stream.set(monitor.id, monitor);
        if (monitor.recording) {
          stream.record(monitor.id);
        } else {
          stream.stopRecord(monitor.id);
        }
      } else {
        stream.stop(monitor.id);
        stream.create(monitor, monitor.connection_uri);
      }
    } else {
      stream.create(monitor, monitor.connection_uri);
    }
  });

  // Stop unexisted monitors
  const streams = stream.getAll();
  for (let streamId in streams) {
    const streamObject = data.find(monitor => monitor.id === streamId);
    if (!streamObject) {
      console.log("Stopping " + streamId);
      stream.stop(streamId);
    }
  }
}

setInterval(() => {
  run().catch(err => {
    console.log(err);
  });
}, 1000);
