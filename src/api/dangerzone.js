const express = require("express");
const router = express.Router();
const moment = require('moment');
const DATE_FORMAT = 'YYYY-MM-DD';

const { sequelize } = require("../lib/db");

const { QueryTypes } = require("sequelize");


router.get('/machines', async (req, res) => {
  try {
    const { engine = 'danger-zone' } = req.query;
    const username = req.user["cognito:username"];

    const machines = await sequelize.query("SELECT *, SUM(count) as count FROM (SELECT a.id as monitor_id,a.name,a.machine_id,a.device_id,a.ip, a.time_in, a.time_out,(SELECT COUNT(*) FROM `detectionsview`  WHERE  username=:username AND alert = '1' AND engine=:engine AND monitor_id = a.id) as count FROM `monitors` a WHERE user_id=:username) a GROUP BY a.machine_id ORDER BY time_in ASC, time_out DESC",
      {
        replacements: { engine, username },
        type: QueryTypes.SELECT
      });

    res
      .send({
        machines
      })
      .status(200)
      .end();

  } catch (err) {
    console.error(err)
    res
      .status(400)
      .send({
        message: err.message
      })
      .end();
  }
});


router.get('/cameras', async (req, res) => {
  try {
    const { engine = 'danger-zone' } = req.query;
    const username = req.user["cognito:username"];

    const cameras = await sequelize.query("SELECT *, SUM(count) as count FROM (SELECT a.id as monitor_id,a.name,a.machine_id,a.device_id,a.ip, a.time_in, a.time_out,(SELECT COUNT(*) FROM `detectionsview`  WHERE  username=:username AND alert = '1' AND engine=:engine AND monitor_id = a.id) as count FROM `monitors` a where user_id=:username) a GROUP BY a.monitor_id ORDER BY time_in ASC, time_out DESC",
      {
        replacements: { engine, username },
        type: QueryTypes.SELECT
      });

    res
      .send({
        cameras
      })
      .status(200)
      .end();

  } catch (err) {
    console.error(err)
    res
      .status(400)
      .send({
        message: err.message
      })
      .end();
  }
});



router.get('/camera-devices', async (req, res) => {
  try {
    const { machine_id } = req.query;
    const username = req.user["cognito:username"];

    const devices = await sequelize.query("SELECT * FROM `monitors` a WHERE user_id=:username AND a.machine_id=:machine_id",
      {
        replacements: { machine_id, username },
        type: QueryTypes.SELECT
      });


    res
      .send({
        devices
      })
      .status(200)
      .end();

  } catch (err) {
    console.error(err)
    res
      .status(400)
      .send({
        message: err.message
      })
      .end();
  }
});



router.get('/zoom-config', async (req, res) => {
  try {
    const zoomConfigs = await sequelize.query("SELECT * FROM `zoom_config`",
      {
        // replacements: {},
        type: QueryTypes.SELECT
      });

    res
      .send({
        zoomConfigs
      })
      .status(200)
      .end();

  } catch (err) {
    console.error(err)
    res
      .status(400)
      .send({
        message: err.message
      })
      .end();
  }
});

router.get('/device-logs', async (req, res) => {
  try {


    const { period_from = moment().format(DATE_FORMAT), period_to = moment().format(DATE_FORMAT), monitor_id = '', machine_id = '' } = req.query;

    const socketLogs = await sequelize.query("SELECT * FROM device_logs where (:machine_id='' OR machine_id=:machine_id) AND (:monitor_id='' OR monitor_id=:monitor_id) AND DATE(created_at) BETWEEN :period_from AND :period_to",
      {
        replacements: { period_from, period_to, monitor_id, machine_id },
        type: QueryTypes.SELECT
      });

    const socketLogsHourly = await sequelize.query("SELECT * FROM device_logs_hourly where  (:machine_id='' OR machine_id=:machine_id) AND (:monitor_id='' OR monitor_id=:monitor_id) AND DATE(created_at) BETWEEN :period_from AND :period_to",
      {
        replacements: { period_from, period_to, monitor_id, machine_id },
        type: QueryTypes.SELECT
      });

    const socketLogsDaily = await sequelize.query("SELECT * FROM device_logs_daily_all where  (:machine_id='' OR machine_id IS NULL OR  machine_id=:machine_id) AND (:monitor_id='' OR monitor_id IS NULL OR monitor_id=:monitor_id)  AND date BETWEEN :period_from AND :period_to",
      {
        replacements: { period_from, period_to, monitor_id, machine_id },
        type: QueryTypes.SELECT
      });



    res
      .send({
        socketLogs,
        socketLogsHourly,
        socketLogsDaily
      })
      .status(200)
      .end();

  } catch (err) {
    console.error(err)
    res
      .status(400)
      .send({
        message: err.message
      })
      .end();
  }
});

router.get('/detections', async (req, res) => {
  try {

    let detections;
    const { period_from, period_to, engine = 'danger-zone', monitor_id } = req.query;
    const username = req.user["cognito:username"];

    console.log(username,engine,monitor_id)
    if (period_from && period_to) {
      detections = await sequelize.query("SELECT a.id,a.name,a.machine_id,a.device_id,a.ip,a.config, b.* FROM `monitors` a RIGHT JOIN `detectionsview`  b ON a.id= b.monitor_id WHERE username=:username AND b.alert = '1' AND b.monitor_id = :monitor_id AND engine=:engine AND DATE(b.created_at) BETWEEN :period_from AND :period_to AND video_url IS NOT NULL ORDER BY b.created_at DESC LIMIT 5",
        {
          replacements: {
            period_from, period_to,
            engine, monitor_id,
            username
          },
          type: QueryTypes.SELECT
        });
    } else if(monitor_id) {
      detections = await sequelize.query("SELECT a.id,a.name,a.machine_id,a.device_id,a.ip,a.config, b.* FROM `monitors` a RIGHT JOIN `detectionsview`  b ON a.id= b.monitor_id WHERE username=:username AND b.alert = '1' AND b.monitor_id = :monitor_id AND engine=:engine AND video_url IS NOT NULL ORDER BY b.created_at DESC LIMIT 5",
        {
          replacements: {
            engine, monitor_id,username
          },
          type: QueryTypes.SELECT
        });

    } else {
      detections = await sequelize.query("SELECT a.id,a.name,a.machine_id,a.device_id,a.ip,a.config, b.* FROM `monitors` a RIGHT JOIN `detectionsview`  b ON a.id= b.monitor_id WHERE username=:username AND b.alert = '1' AND engine=:engine AND video_url IS NOT NULL ORDER BY b.created_at DESC LIMIT 5",
        {
          replacements: {
            engine, username
          },
          type: QueryTypes.SELECT
        });

    }

    res
      .send({
        detections,
      })
      .status(200)
      .end();

  } catch (err) {
    console.error(err)
    res
      .status(400)
      .send({
        message: err.message
      })
      .end();
  }
});


router.get('/snapshot/:monitor_id', async (req, res) => {
  try {


    const { monitor_id } = req.params;
    const username = req.user["cognito:username"];

    const detections = await sequelize.query("SELECT * FROM `detectionsview`  WHERE  username=:username AND  image_url IS NOT NULL AND monitor_id = :monitor_id and image_url IS NOT NULL ORDER BY created_at DESC LIMIT 1",
      {
        replacements: {
          monitor_id,
          username
        },
        type: QueryTypes.SELECT
      });


    if (detections[0]) {
      res
        .send(detections[0])
        .status(200)
        .end();

    } else {
      res
        .status(404)
        .send({
          message: 'No snapshot available'
        })
        .end();
    }

  } catch (err) {
    console.error(err)
    res
      .status(400)
      .send({
        message: err.message
      })
      .end();
  }
});


router.get('/alert-distribution', async (req, res) => {
  try {


    const { period_from = moment().format(DATE_FORMAT), period_to = moment().format(DATE_FORMAT), machine_id = '', monitor_id = '', engine = 'danger-zone' } = req.query;
    const username = req.user["cognito:username"];

    const detectionsDaily = await sequelize.query("SELECT * FROM detections_daily_camera WHERE user_id=:username AND (:machine_id='' OR machine_id=:machine_id) AND engine=:engine AND (:monitor_id='' OR monitor_id=:monitor_id) AND date BETWEEN :period_from AND :period_to ORDER BY date ASC",
      {
        replacements: {
          period_from, period_to,
          machine_id,
          monitor_id,
          engine,username
        },
        type: QueryTypes.SELECT
      });



    const detectionsHourly = await sequelize.query("SELECT * FROM detections_hourly WHERE user_id=:username AND  (:machine_id='' OR machine_id=:machine_id) AND engine=:engine AND (:monitor_id='' OR monitor_id=:monitor_id) AND date = CURDATE()",
      {
        replacements: {
          period_from, period_to,
          machine_id, monitor_id,
          engine, username
        },
        type: QueryTypes.SELECT
      });


    const output = {};
    detectionsDaily.forEach(obj => {
      if (!output[obj.date]) {
        output[obj.date] = {}
      }
      output[obj.date][obj.monitor_id] = obj.count;
    })

    const output_hourly = {}
    detectionsHourly.forEach(obj => {
      if (!output_hourly[`${obj.hour}:00`]) {
        output_hourly[`${obj.hour}:00`] = {}
      }
      output_hourly[`${obj.hour}:00`][obj.monitor_id] = obj.count;
    })

    const result1 = []
    const result2 = []

    Object.keys(output).forEach(key => {
      result1.push({
        date: key,
        ...output[key]
      })
    })

    Object.keys(output_hourly).forEach(key => {
      result2.push({
        hour: key,
        ...output_hourly[key]
      })
    })

    res
      .send({
        detectionsDaily: result1,
        detectionsHourly: result2
      })
      .status(200)
      .end();

  } catch (err) {
    console.error(err)
    res
      .status(400)
      .send({
        message: err.message
      })
      .end();
  }
});




module.exports = router;
