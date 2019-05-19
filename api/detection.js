const express = require("express");
const router = express.Router();
const DB = require("../lib/db");
const moment = require("moment");
const uuidv4 = require("uuid/v4");
const Detection = require("../models/detection.js");

router.get("/", (req, res, next) => {
  // Get All For User
  res
    .send("WIP")
    .status(200)
    .end();
});

router.get("/:id", async (req, res, next) => {
  try {
    var data = await Detection.findOne({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(data);
  } catch (err) {
    res
      .send(err)
      .status(400)
      .end();
  }
});

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

    await Watcher.create(newDetetion);

    res.status(200).json({
      id: newDetection.id,
      message: "Successfully Added Detection"
    });
  } catch (err) {
    res
      .send(err)
      .status(400)
      .end();
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    await Watcher.update(req.body, {
      where: { id: req.params.id }
    });
    res.status(200).json({
      message: "Successfully Updated"
    });
  } catch (err) {
    res
      .send(err)
      .status(400)
      .end();
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    res
      .send("WIP")
      .status(200)
      .end();
  } catch (err) {
    res
      .send(err)
      .status(400)
      .end();
  }
});

module.exports = router;
