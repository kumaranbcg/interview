const express = require("express");
const router = express.Router();
const uuidv4 = require("uuid/v4");
const Detection = require("../models/detection.js");
const Monitor = require("../models/monitor");
const Alert = require("../models/alert");
const AlertLog = require("../models/alert-log");
const io = require("../io")();
const alertUtil = require("../lib/alert");
const { Op } = require("sequelize");
const moment = require("moment");

router.post("/", async (req, res, next) => {
  try {
    // Create Monitor In Our Database

    const numberOfPerson = req.body.result.length;
    const numberOfSmoker = req.body.result.filter(
      item => item.conf && item.conf > 0.5
    ).length;

    const newDetection = {
      id: uuidv4(),
      monitor_id: req.body.monitor_id,
      result: req.body.result,
      alert: req.body.alert || false,
      timestamp: new Date(),
      numberOfPerson,
      numberOfSmoker
    };

    await Detection.create(newDetection);
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
      if (alert.monitor.engines.indexOf(req.body.engine) !== -1) {
        const recentLog = await AlertLog.findOne({
          where: {
            createdAt: {
              [Op.gte]: moment()
                .subtract(1, "minutes")
                .toDate()
            },
            alert_id: alert.id
          }
        });

        if (!recentLog) {
          if (alert.trigger_record === true) {
            await Monitor.update(
              {
                recording: true
              },
              {
                where: {
                  id: req.body.monitor_id
                }
              }
            );
            setTimeout(() => {
              Monitor.update(
                {
                  recording: false
                },
                {
                  where: {
                    id: req.body.monitor_id
                  }
                }
              );
            }, 20 * 1000);
          }
          await AlertLog.create({
            id: uuidv4(),
            alert_id: alert.id
          });
          await alertUtil.alert(alert);
        }
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

module.exports = router;
