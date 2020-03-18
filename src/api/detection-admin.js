const express = require("express");
const router = express.Router();
const uuidv4 = require("uuid/v4");
const fs = require('fs');
const path = require('path');

const { AlertLog, Alert, Monitor, Detection, Projects, SocketLog } = require("../lib/db");

const alertUtil = require("../lib/alert");
const { Op } = require("sequelize");
const moment = require("moment");

const MEDIA_URL = "https://sgp1.digitaloceanspaces.com/viact";

router.post("/", async (req, res, next) => {
  try {
    // Create Monitor In Our Database

    const current_date = moment(new Date()).format('YYYY-MM-DD')

    const query = {
      where: {
        [Op.and]: [{
          period_from: {
            [Op.lte]: current_date
          }
        }, {
          period_to: {
            [Op.gte]: current_date
          }
        }]
      }
    }


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

router.post("/incoming", async (req, res) => {
  try {
    const { alert = "Y", timestamp = new Date(), monitor_id, engine = "helmet" } = req.body;
    const current_date = moment(new Date()).format('YYYY-MM-DD')

    if (!monitor_id) {
      throw new Error("No Monitor, check the 'monitor' key in your post");
    }

    const uuid = uuidv4();
    const query = {
      where: {
        [Op.and]: [{
          period_from: {
            [Op.lte]: current_date
          }
        }, {
          period_to: {
            [Op.gte]: current_date
          }
        }]
      }
    }


    const project = await Projects.findOne(query)

    const newDetection = {
      ...req.body,
      id: uuid,
      monitor_id,
      truck_capacity: project ? project.capacity : 1,
      alert: alert === 'Y',
      timestamp,
      engine
    };
    await Detection.create(newDetection);
    let alertsResult = {};

    if (newDetection.alert) {

      console.log('alert detected')

      try {
        const alert = await Detection.findOne({
          where: {
            id: newDetection.id,
          },
          include: [
            {
              model: Monitor,
              required: true,
              as: "monitor"
            }
          ]
        });

        await AlertLog.create({
          id: uuidv4(),
        });
        let url;
        switch (engine) {
          case 'dump-truck':
            url = 'http://hhdt1.viact.ai/#/user/dashboard/dump-truck/1/truck-activities';
            break;
          case 'danger-zone':
            url = 'http://hhdt1.viact.ai/#/user/dashboard/danger-zone-2';
            break;
          default:
            url = 'http://hhdt1.viact.ai/#/user/dashboard/';
            break;
        }
        // alertsResult = await alertUtil.do({
        //   image: `${MEDIA_URL}/alerts/${monitor_id}/${uuid}.jpg`,
        //   url
        // }, alert);

        console.log(`Made an alert at ${new Date().toString()}!`);
      } catch (err) {
        console.log("Alert error");
        console.log(err.message);
      }
    }


    res.status(200).json({
      id: newDetection.id,
      ...alertsResult,
      message: "Successfully Added Detection"
    });

  } catch (err) {
    if (err.name && err.name === 'SequelizeForeignKeyConstraintError') {
      res
        .status(400)
        .send('Check if the device is registered')
        .end();
    } else {

      res
        .status(400)
        .send(err.message || err.name)
        .end();
    }
  }
});

module.exports = router;
