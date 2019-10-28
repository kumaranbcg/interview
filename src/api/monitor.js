const express = require("express");
const shortid = require("shortid");
const router = express.Router();
const DB = require("../lib/db");
const Monitor = require("../models/monitor");
const Vod = require("../models/vod");
const Detection = require("../models/detection");
const axios = require("axios");
const url = require("url");
const { Op } = require("sequelize");

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

router.get("/:id/detection", async (req, res, next) => {
  try {
    const query = {
      where: {
        monitor_id: req.params.id
      },
      order: [[req.query.orderBy || "createdAt", req.query.direction || "DESC"]]
    };

    if (req.query.limit) {
      query.limit = parseInt(req.query.limit);
      if (req.query.page) {
        query.offset =
          (parseInt(req.query.page) - 1) * parseInt(req.query.limit);
      }
    }

    if (req.query.engine) {
      query.where.engine = req.query.engine;
    }
    if (req.query.start_timestamp) {
      query.where.createdAt = {
        [Op.gte]: new Date(parseInt(req.query.start_timestamp))
      };
    }
    if (req.query.end_timestamp) {
      if (!query.where.createdAt) {
        query.where.createdAt = {
          [Op.lte]: new Date(parseInt(req.query.end_timestamp))
        };
      } else {
        query.where.createdAt = {
          ...query.where.createdAt,
          [Op.lte]: new Date(parseInt(req.query.end_timestamp))
        };
      }
    }
    if (req.query.alert) {
      query.where.alert = true;
    }

    const data = await Detection.findAll(query);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.get("/:id/vod", async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const data = await Vod.findAndCountAll({
      where: {
        monitor_id: req.params.id
      },
      limit,
      offset,
      order: [[req.query.orderBy || "createdAt", req.query.direction || "DESC"]]
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
      .status(400)
      .send(err)

      .end();
  }
});

router.post("/", async (req, res, next) => {
  console.log("Creating Monitor");
  try {
    if (process.env.NODE_ENV === "local") {
    } else {
      console.log("Checking server address");
      await axios.get(
        "https://media.customindz.com/server/probe?path=" +
          req.body.connection_uri
      );
    }

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
      .status(400)
      .send(err.message)
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
      .status(400)
      .send(err)
      .end();
  }
});

module.exports = router;
