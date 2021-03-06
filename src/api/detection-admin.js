const express = require("express");
const router = express.Router();
const uuidv4 = require("uuid/v4");

const { AlertLog, Alert, Monitor, Detection } = require("../lib/db");

const alertUtil = require("../lib/alert");
const { Op } = require("sequelize");
const moment = require("moment");
const s3 = require("../lib/s3");

const MEDIA_URL = "https://sgp1.digitaloceanspaces.com/viact20";

router.post("/", async (req, res, next) => {
  try {
    // Create Monitor In Our Database

    const newDetection = {
      id: uuidv4(),
      monitor_id: req.body.monitor_id,
      result: req.body.result,
      alert: req.body.alert || false,
      timestamp: new Date(),
      image_url: req.body.image_url,
      engine: req.body.engine
    };

    await Detection.create(newDetection);

    // if (req.body.alert === true && req.body.engine) {
    //   const alert = await Alert.find({
    //     where: {
    //       monitor_id: req.body.monitor_id,
    //       engine: req.body.engine
    //     },
    //     include: [
    //       {
    //         model: Monitor,
    //         required: true
    //       }
    //     ]
    //   });
    //   if (alert.monitor.engines.indexOf(req.body.engine) !== -1) {
    //     const recentLog = await AlertLog.findOne({
    //       where: {
    //         createdAt: {
    //           [Op.gte]: moment()
    //             .subtract(alert.interval || 1, "minutes")
    //             .toDate()
    //         },
    //         alert_id: alert.id
    //       }
    //     });

    //     if (!recentLog) {
    //       if (alert.trigger_record === true) {
    //         await Monitor.update(
    //           {
    //             recording: true
    //           },
    //           {
    //             where: {
    //               id: req.body.monitor_id
    //             }
    //           }
    //         );
    //         setTimeout(() => {
    //           Monitor.update(
    //             {
    //               recording: false
    //             },
    //             {
    //               where: {
    //                 id: req.body.monitor_id
    //               }
    //             }
    //           );
    //         }, 20 * 1000);
    //       }

    //       await AlertLog.create({
    //         id: uuidv4(),
    //         alert_id: alert.id
    //       });

    //       await alertUtil.alert(alert);
    //     }
    //   }
    // }

    res.status(200).json({
      id: newDetection.id,
      message: "Successfully Added Detection"
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.post("/incoming", async (req, res, next) => {
  try {
    const { result, monitor_id, engine = "helmet" } = req.body;

    if (!monitor_id) {
      throw new Error("No Monitor, check the 'monitor' key in your post");
    }


    if (result !== 'Y') {
      res.status(200).json({
        message: "No Alert, Detection skipped"
      });
      return;
    }

    const uuid = uuidv4();

    await s3
      .copyObject({
        ACL: "public-read",
        CopySource: `/viact20/frames/${monitor_id}/latest-detection-helmet.jpg`,
        Bucket: "viact20",
        Key: `alerts/${monitor_id}/${uuid}.jpg`
      })
      .promise();

    const newDetection = {
      id: uuid,
      monitor_id,
      result,
      alert: result === 'Y',
      timestamp: new Date(),
      image_url: `${MEDIA_URL}/alerts/${monitor_id}/${uuid}.jpg`,
      engine: req.body.engine || "helmet"
    };
    await Detection.create(newDetection);

    res.status(200).json({
      id: newDetection.id,
      message: "Successfully Added Detection"
    });

    try {
      const alert = await Alert.findOne({
        where: {
          monitor_id,
          engine,
          alert_type: "Trigger"
        },
        include: [
          {
            model: Monitor,
            required: true,
            as: "monitor"
          }
        ]
      });

      if (!alert) {
        return;
      }

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
        await AlertLog.create({
          id: uuidv4(),
          alert_id: alert.id
        });

        const alerts = [alert];

        alertUtil.do(alerts, {
          image: `${MEDIA_URL}/alerts/${monitor_id}/${uuid}.jpg`,
          url: `http://app.viact.ai/#/report/${monitor_id}/detection/${uuid}`
        });

        console.log(`Made an alert at ${new Date().toString()}!`);
      }
    } catch (err) {
      console.log("Alert error");
      console.log(err.message);
    }
  } catch (err) {
    console.log(err.message || err.name);
    res
      .status(400)
      .send(err.message || err.name)
      .end();
  }
});

module.exports = router;
