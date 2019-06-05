const express = require("express");
const shortid = require("shortid");
const router = express.Router();
const { BASE, API_KEY, GROUP_KEY } = require("../shinobiConfig.json");
const { defaultDetail, defaultConfig } = require("../defaultShinobiConfig");
const BASE_API = BASE + "/" + API_KEY;
const DB = require("../lib/db");
const Monitor = require("../models/monitor");
const Detection = require("../models/detection");
const axios = require("axios");
const url = require("url");

router.get("/", async (req, res) => {
  // Get All For User
  try {
    const data = await Monitor.findAll({
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
      .status(400)
      .send(err)
      .end();
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let data = await Monitor.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!data) {
      throw new Error("No Monitor Found");
    }
    res.send(data);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)
      .end();
  }
});

// Get the latest detection for a monitor
router.get("/:id/latest_detection", async (req, res, next) => {
  try {
    var data = await Detection.findAll({
      where: {
        monitor_id: req.params.id
      },
      limit: req.query.number || 1,
      order: [["timestamp", "DESC"]]
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
  console.log("Creating Monitor");
  try {
    await axios.get(
      "https://media.customindz.com/server/probe?path=" +
        req.body.connection_uri
    );

    const MONITOR_ID = shortid.generate();
    const newMonitor = {
      id: MONITOR_ID,
      user_id: req.body.user["cognito:username"],
      name: req.body.name || "Default Monitor Name",
      connection_uri: req.body.connection_uri,
      play_from_source: false,
      graph: [],
      engines: []
    };

    await Monitor.create(newMonitor);

    res.status(200).json({
      id: newMonitor.id,
      message: "Successfully Added Monitor"
    });
  } catch (err) {
    console.log(err);
    res
      .send(err.message)
      .status(400)
      .end();
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    delete req.body.id;
    await Monitor.update(req.body, {
      where: { id: req.params.id }
    });
    res
      .send({
        message: "Successfully Update"
      })
      .status(200)
      .end();
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    // const MONITOR_ID = req.params.id;
    // await axios.get(
    //   `${BASE_API}/configureMonitor/${GROUP_KEY}/${MONITOR_ID}/delete`
    // );

    await Monitor.destroy({
      where: {
        id: req.params.id
      }
    });

    res
      .json({
        message: "Successfully Deleted Monitor"
      })
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
