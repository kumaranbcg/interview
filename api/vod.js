const express = require("express");
const router = express.Router();
const uuidv4 = require("uuid/v4");
const Vod = require("../models/vod.js");

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
    const newVod = {
      id: uuidv4(),
      monitor_id: req.body.monitor_id,
      mp4_url: req.body.mp4_url,
      timestamp: new Date()
    };

    await Vod.create(newDetetion);

    res.status(200).json({
      id: newVod.id,
      message: "Successfully Added Vod"
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
    await Vod.update(req.body, {
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
