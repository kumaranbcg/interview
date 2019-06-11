const express = require("express");
const router = express.Router();
const uuidv4 = require("uuid/v4");
const Detection = require("../models/detection.js");
const Monitor = require("../models/monitor");
const Alert = require("../models/alert");
const AlertLog = require("../models/alert-log");
const io = require("../io")();
const kafka = require("../lib/kafka");
const alertUtil = require("../lib/alert");
const { Op } = require("sequelize");
const moment = require("moment");

router.post("/", async (req, res, next) => {
  try {
    // Create Monitor In Our Database
    const newDetection = {
      id: uuidv4(),
      monitor_id: req.body.monitor_id,
      result: req.body.result,
      alert: req.body.alert || false,
      timestamp: new Date()
    };

    // await Detection.create(newDetection);
    io.in(req.body.monitor_id).emit("detection", req.body.result || []);

    if (req.body.alert === true && req.body.engine) {
      const alert = await Alert.findOne({
        where: {
          monitor_id: req.body.monitor_id,
          engine: req.body.engine
        },
        include: [
          {
            model: Monitor,
            required: true
          }
        ]
      });

      const recentLog = await AlertLog.findOne({
        where: {
          createdAt: {
            [Op.gte]: moment()
              .subtract(1, "minutes")
              .toDate()
          }
        }
      });

      if (!recentLog) {
        await AlertLog.create({
          id: uuidv4(),
          alert_id: alert.id
        });
        await alertUtil.alert(alert);
      }
    }

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
