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
      .send(err)
      .status(400)
      .end();
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    // Several Things To Do When setup
    const shinobiResponse = await axios.get(
      `${BASE_API}/monitor/${GROUP_KEY}/${req.params.id}`
    );

    const shinobiMonitor = shinobiResponse.data;

    let data = await Monitor.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!data) {
      throw new Error("No Monitor Found");
    }

    res.send({
      monitor: data,
      shinobi: shinobiMonitor
    });
  } catch (err) {
    console.log(err);
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
  console.log("Creating Monitor");
  try {
    // Several Things To Do When setup
    const MONITOR_ID = shortid.generate();
    const { host, port, path, protocol } = url.parse(req.body.connection_uri);
    const config = {
      ...defaultConfig,
      mid: MONITOR_ID,
      host,
      port: port || (protocol === "https" ? 443 : 80),
      path,
      protocol: protocol.replace(":", ""),
      name: req.body.name || "Default Monitor Name",
      details: JSON.stringify({
        ...defaultDetail,
        auto_host: req.body.connection_uri
      })
    };

    console.log(config);

    await axios.get(
      `${BASE_API}/configureMonitor/${GROUP_KEY}/${MONITOR_ID}/add?data=` +
        JSON.stringify(config),
      {
        timeout: 1000
      }
    );

    const newMonitor = {
      id: MONITOR_ID,
      user_id: req.body.user["cognito:username"],
      name: req.body.name || "Default Monitor Name",
      connection_uri: req.body.connection_uri,
      play_from_source: req.body.play_from_source
    };

    await Monitor.create(newMonitor);

    // Create Monitor In Our Database
    res.status(200).json({
      id: newMonitor.id,
      message: "Successfully Added Detection"
    });
  } catch (err) {
    console.log(err);
    res
      .send(err)
      .status(400)
      .end();
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const MONITOR_ID = req.params.id;

    if (req.body.connection_uri) {
      const { host, port, path, protocol } = url.parse(req.body.connection_uri);
      const config = {
        ...defaultConfig,
        mid: MONITOR_ID,
        host,
        port: port || (protocol === "https" ? 443 : 80),
        path,
        protocol: protocol.replace(":", ""),
        name: req.body.name || "Default Monitor Name",
        details: JSON.stringify({
          ...defaultDetail,
          auto_host: req.body.connection_uri
        })
      };
      await axios.get(
        `${BASE_API}/configureMonitor/${GROUP_KEY}/${MONITOR_ID}/edit?data=` +
          JSON.stringify(config),
        {
          timeout: 1000
        }
      );
    }

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
    res
      .send(err)
      .status(400)
      .end();
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const MONITOR_ID = req.params.id;
    await axios.get(
      `${BASE_API}/configureMonitor/${GROUP_KEY}/${MONITOR_ID}/delete`
    );

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
