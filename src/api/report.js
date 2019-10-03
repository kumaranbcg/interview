const express = require("express");
const moment = require("moment");
const router = express.Router();
const Detection = require("../models/detection.js");
const Monitor = require("../models/monitor.js");
const Vod = require("../models/vod.js");
const { Op } = require("sequelize");

router.get("/detection/:id", async (req, res, next) => {
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

router.get("/detection/:id/vod", async (req, res, next) => {
  try {
    var detection = await Detection.findOne({
      where: {
        id: req.params.id
      }
    });

    const timestamp = detection.createdAt;

    const vods = await Vod.findAll({
      where: {
        monitor_id: detection.monitor_id,
        start_timestamp: {
          [Op.lte]: timestamp
        },
        end_timestamp: {
          [Op.gte]: timestamp
        }
      }
    });

    res.status(200).json(vods);
  } catch (err) {
    res
      .send(err.message)
      .status(400)
      .end();
  }
});

router.get("/monitor/:id", async (req, res, next) => {
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

router.get("/monitor/:id/detection", async (req, res, next) => {
  try {
    const query = {
      where: {
        monitor_id: req.params.id
      },
      order: [[req.query.orderBy || "createdAt", req.query.direction || "DESC"]]
    };
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
          [Op.lte]: new Date(req.query.end_timestamp)
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

router.get("/monitor/:id/vod", async (req, res, next) => {
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

module.exports = router;
