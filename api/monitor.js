const express = require("express");
const shortid = require("shortid");
const router = express.Router();
const { BASE, API_KEY, GROUP_KEY } = require("../shinobiConfig.json");
const BASE_API = BASE + API_KEY + "/";
const DB = require("../lib/db");
const Monitor = require("../models/monitor");
const Detection = require("../models/detection");
router.get("/all", (req, res, next) => {
  // Get All For User
  res
    .send("WIP")
    .status(200)
    .end();
});

router.get("/:id", async (req, res, next) => {
  try {
    // Several Things To Do When setup
    const shinobiResponse = await axios.get(
      `${BASE_API}/monitor/${GROUP_KEY}/${MONITOR_ID}`
    );

    const shinobiMonitor = shinobiResponse.data;

    res
      .send({
        monitor: shinobiMonitor
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
  try {
    // Several Things To Do When setup
    const MONITOR_ID = shortid.generate();
    const config = JSON.stringify(req.body.config);
    await axios.get(
      `${BASE_API}/configureMonitor/${GROUP_KEY}/${MONITOR_ID}/add?data=` +
        config
    );

    // Create Monitor In Our Database
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

router.put("/:id", async (req, res, next) => {
  try {
    const MONITOR_ID = req.body.monitor_id;
    const config = JSON.stringify(req.body.config);
    await axios.get(
      `${BASE_API}/configureMonitor/${GROUP_KEY}/${MONITOR_ID}/edit?data=` +
        config
    );
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

router.delete("/:id", async (req, res, next) => {
  try {
    const MONITOR_ID = req.body.monitor_id;
    await axios.get(
      `${BASE_API}/configureMonitor/${GROUP_KEY}/${MONITOR_ID}/delete`
    );
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
