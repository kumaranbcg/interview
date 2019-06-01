const express = require("express");
const router = express.Router();
const uuidv4 = require("uuid/v4");
const Vod = require("../models/vod.js");
const Monitor = require("../models/monitor");

router.get("/", async (req, res) => {
  try {
    const data = await Vod.findAll({
      where: {
        user_id: req.body.user["cognito:username"]
      }
    });
    res
      .send(data)
      .status(200)
      .end();
  } catch (err) {
    console.log(err);
    res
      .send(err)
      .status(400)
      .end();
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    var data = await Vod.findOne({
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
    console.log(req.body.monitor_id);
    let monitorData = await Monitor.findOne({
      where: {
        id: req.body.monitor_id
      }
    });

    const newVod = {
      id: uuidv4(),
      monitor_id: req.body.monitor_id,
      flv_url: req.body.flv_url,
      user_id: monitorData.user_id,
      thumbnail_url: req.body.thumbnail_url,
      timestamp: new Date(req.body.timestamp)
    };

    await Vod.create(newVod);

    res.status(200).json({
      id: newVod.id,
      message: "Successfully Added Vod"
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    await Vod.update(req.body, {
      where: { id: req.params.id }
    });
    res.status(200).json({
      message: "Successfully Updated"
    });
  } catch (err) {
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Vod.destroy({
      where: {
        id: req.params.id
      }
    });
    res
      .json({
        message: "Successfully Deleted Vod"
      })
      .status(200)
      .end();
  } catch (err) {
    res
      .status(400)
      .send(err)
      .end();
  }
});

module.exports = router;
