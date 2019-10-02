const express = require("express");
const moment = require("moment");
const router = express.Router();
const Detection = require("../models/detection.js");
const Monitor = require("../models/monitor.js");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  try {
    const query = {
      where: {
        alert: true,
        image_url: {
          [Op.ne]: null
        }
      },
      order: [[req.query.orderBy || "createdAt", req.query.direction || "DESC"]]
    };

    if (req.query.engine) {
      query.where.engine = req.query.engine;
    }

    if (req.query.start_timestamp) {
      query.where.timestamp = {
        [Op.gte]: new Date(req.query.start_timestamp)
      };
    }

    if (req.query.end_timestamp) {
      query.where.timestamp = {
        [Op.lte]: new Date(req.query.end_timestamp)
      };
    }

    query.include = [
      {
        model: Monitor,
        required: true,
        where: {
          user_id: req.body.user["cognito:username"]
        }
      }
    ];
    const data = await Detection.findAndCountAll(query);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.get("/engine/:engineName", async (req, res) => {
  // Get All For User
  try {
    let interval = req.query.interval || "second";
    let limit = 7;

    if (interval === "perfiveminute") {
      limit = 7 * 5 * 30;
    } else if (interval === "hourly") {
      limit = 7 * 60 * 30;
    } else if (interval === "daily") {
      limit = 7 * 60 * 30 * 24;
    }

    const data = await Detection.findAll({
      limit,
      where: {
        monitor_id: req.query.monitor_id
      },
      order: [["createdAt", "DESC"]]
    });

    let returnData;
    returnData = new Array(7);
    let subtract = 1;
    if (interval === "second") {
      subtract = 1;
    }
    if (interval === "perfiveminute") {
      subtract = 60 * 5;
    }
    if (interval === "hourly") {
      subtract = 60 * 60;
    }
    if (interval === "daily") {
      subtract = 60 * 60 * 24;
    }
    for (var i = 0; i < 7; i++) {
      const anchor = [
        moment().subtract((7 - i) * subtract, "second"),
        moment().subtract((6 - i) * subtract, "second")
      ];
      data.forEach(detection => {
        const isSameOrAfter = moment(detection.createdAt).isSameOrAfter(
          anchor[0]
        );
        const isBefore = moment(detection.createdAt).isBefore(anchor[1]);
        if (isSameOrAfter && isBefore) {
          if (!returnData[i]) {
            returnData[i] = {
              numberOfPerson: detection.numberOfPerson,
              numberOfSmoker: detection.numberOfSmoker
            };
          } else {
            returnData[i].numberOfPerson += detection.numberOfPerson;
            returnData[i].numberOfSmoker += detection.numberOfSmoker;
          }
        } else {
          returnData[i] = {
            numberOfPerson: 0,
            numberOfSmoker: 0
          };
        }
      });

      if (!data) {
        returnData = returnData.map(() => ({
          numberOfPerson: 0,
          numberOfSmoker: 0
        }));
      }
    }

    if (returnData.length < 7) {
      for (var i = 0; i < 7 - returnData.length; i++) {
        returnData.unshift({
          numberOfPerson: 0,
          numberOfSmoker: 0
        });
      }
    }

    res.send(returnData);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
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

router.get("/:id/vod", async (req, res, next) => {
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
      .send(err)
      .status(400)
      .end();
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    await Detection.update(req.body, {
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