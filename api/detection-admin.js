const express = require("express");
const router = express.Router();
const uuidv4 = require("uuid/v4");
const Detection = require("../models/detection.js");
const io = require("../io")();
const kafka = require("../lib/kafka");

router.post("/", async (req, res, next) => {
  try {
    // Create Monitor In Our Database
    const newDetection = {
      id: uuidv4(),
      monitor_id: req.body.monitor_id,
      result: req.body.result,
      alert: req.body.result.alert || false,
      timestamp: new Date()
    };

    // await Detection.create(newDetection);
    io.in(req.body.monitor_id).emit("detection", req.body.result || []);

    res.status(200).json({
      id: newDetection.id,
      message: "Successfully Added Detection"
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)

      .end();
  }
});

kafka.on("message", message => {
  console.log(message);
});

module.exports = router;
