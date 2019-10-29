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
const aws = require("../lib/aws");
const s3 = new aws.S3({});

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
    io.in(req.body.monitor_id).emit("detection", req.body.result || []);

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
    // Create Monitor In Our Database

    // io.in(req.body.monitor_id).emit("detection", req.body.result || []);

    const MONITOR = req.body.monitor_id;

    io.in(MONITOR).emit("detection", req.body.alert || []);

    // const minimumDetection = await Detection.findOne({
    //   where: {
    //     monitor_id: req.body.monitor_id,
    //     engine: req.body.engine || "helmet",
    //     createdAt: {
    //       [Op.gte]: moment()
    //         .subtract(10, "seconds")
    //         .toDate()
    //     }
    //   }
    // });

    // if (minimumDetection) {
    //   throw new Error("Detection abandoned for this request");
    // }

    if (!MONITOR) {
      throw new Error("No Monitor, check the 'monitor' key in your post");
    }

    const noHelmetCount = req.body.alert.filter(type => type === "N").length;
    const isAlertTriggering = noHelmetCount > 0;

    if (!isAlertTriggering) {
      res.status(200).json({
        message: "No Alert, Detection skipped"
      });
      return;
    }

    // const drawedImage = await canvas.draw(IMAGE, boxes);
    // let params = {
    //   ACL: "public-read",
    //   Bucket: "customindz-shinobi",
    //   Key: `frames/${MONITOR}/latest-detection-${req.body.engine}.jpg`,
    //   Body: Buffer.from(IMAGE, "base64")
    // };
    // await s3.putObject(params).promise();

    const uuid = uuidv4();
    await s3
      .copyObject({
        ACL: "public-read",
        CopySource: `/customindz-shinobi/frames/${MONITOR}/latest-detection-helmet.jpg`,
        Bucket: "customindz-shinobi",
        Key: `alerts/${MONITOR}/${uuid}.jpg`
      })
      .promise();
    const newDetection = {
      id: uuid,
      monitor_id: req.body.monitor_id,
      result: req.body.alert,
      alert: isAlertTriggering,
      timestamp: new Date(),
      image_url: `https://customindz-shinobi.s3-ap-southeast-1.amazonaws.com/alerts/${MONITOR}/${uuid}.jpg`,
      engine: req.body.engine || "helmet"
    };
    await Detection.create(newDetection);

    res.status(200).json({
      id: newDetection.id,
      message: "Successfully Added Detection"
    });

    try {
      if (isAlertTriggering) {
        const alert = await Alert.findOne({
          where: {
            monitor_id: req.body.monitor_id,
            engine: req.body.engine || "helmet",
            alert_type: "Trigger"
          },
          include: [
            {
              model: Monitor,
              required: true
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
            image: `https://customindz-shinobi.s3-ap-southeast-1.amazonaws.com/alerts/${MONITOR}/${uuid}.jpg`,
            url: `http://app.viact.ai/#/report/${MONITOR}/detection/${uuid}`
          });

          console.log(`Made an alert at ${new Date().toString()}!`);
        }
      }
    } catch (err) {
      console.log("Alert error");
      console.log(err.message);
    }
  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send(err.message)
      .end();
  }
});

router.post("/incoming-test", async (req, res, next) => {
  try {
    const MONITOR = "tuspark-roof";
    const objects = req.body.objects;

    if (!MONITOR) {
      throw new Error("No Monitor, check the 'monitor' key in your post");
    }

    if (!objects) {
      throw new Error(
        "No Detection Body, check the 'objects' key in your post"
      );
    }

    const noHelmetCount = req.body.alert.filter(type => type === "N").length;
    const isAlertTriggering = noHelmetCount > 0;

    const uuid = uuidv4();

    try {
      const newDetection = {
        id: uuid,
        monitor_id: MONITOR,
        result: req.body.alert,
        alert: isAlertTriggering,
        timestamp: new Date(),
        image_url: `https://customindz-shinobi.s3-ap-southeast-1.amazonaws.com/alerts/${MONITOR}/${uuid}.jpg`,
        engine: req.body.engine || "helmet"
      };
      await Detection.create(newDetection);
    } catch (err) {}

    if (isAlertTriggering) {
      await s3
        .copyObject({
          ACL: "public-read",
          CopySource: `/customindz-shinobi/frames/${MONITOR}/latest-detection-helmet.jpg`,
          Bucket: "customindz-shinobi",
          Key: `alerts/${MONITOR}/${uuid}.jpg`
        })
        .promise();

      const alert = await Alert.findOne({
        where: {
          monitor_id: MONITOR,
          engine: req.body.engine || "helmet",
          alert_type: "Trigger"
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
              .subtract(20, "seconds")
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
          image: `https://customindz-shinobi.s3-ap-southeast-1.amazonaws.com/alerts/${MONITOR}/${uuid}.jpg`,
          url: `https://windht.github.io/customindz-front-end-react-app/#/report/${MONITOR}/detection/${uuid}`
        });
      }
    }

    res.status(200).json({
      id: uuid,
      message: "Successfully Added Detection"
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send(err.message)
      .end();
  }
});

module.exports = router;
