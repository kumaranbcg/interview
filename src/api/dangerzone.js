const express = require("express");
const router = express.Router();
const moment = require('moment');
const DATE_FORMAT = 'YYYY-MM-DD';

const { sequelize } = require("../lib/db");

const { QueryTypes } = require("sequelize");


router.get('/machines', async (req, res) => {
  try {
    const { engine = 'danger-zone' } = req.query;

    const machines = await sequelize.query("SELECT *, SUM(count) as count FROM (SELECT a.id as monitor_id,a.name,a.machine_id,a.device_id,a.ip,b.time_in, b.time_out, (SELECT COUNT(*) FROM `detections` WHERE engine=:engine AND monitor_id = a.id) as count FROM `monitors` a LEFT JOIN (SELECT * FROM `socket_log` ORDER BY created_at DESC) b on a.id= b.camera_id) a GROUP BY a.machine_id;",
      {
        replacements: { engine },
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


router.get('/camera-devices', async (req, res) => {
  try {
    const { engine = 'danger-zone', machine_id } = req.query;

    const devices = await sequelize.query("SELECT * FROM `monitors` a WHERE a.machine_id=:machine_id",
      {
        replacements: { engine, machine_id },
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


router.get('/device-logs', async (req, res) => {
  try {


    const { period_from = moment().format(DATE_FORMAT), period_to = moment().format(DATE_FORMAT), monitor_id = '' } = req.query;

    const socketLogs = await sequelize.query("SELECT * FROM device_logs where (:monitor_id='' OR camera_id=:monitor_id) AND DATE(created_at) BETWEEN :period_from AND :period_to",
      {
        replacements: { period_from, period_to, monitor_id },
        type: QueryTypes.SELECT
      });

    const socketLogsHourly = await sequelize.query("SELECT * FROM device_logs_hourly where  (:monitor_id='' OR camera_id=:monitor_id) AND DATE(created_at) BETWEEN :period_from AND :period_to",
      {
        replacements: { period_from, period_to, monitor_id },
        type: QueryTypes.SELECT
      });

    const socketLogsDaily = await sequelize.query("SELECT * FROM device_logs_daily where  (:monitor_id='' OR camera_id=:monitor_id)  AND DATE(created_at) BETWEEN :period_from AND :period_to",
      {
        replacements: { period_from, period_to, monitor_id },
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


    const { period_from = moment().format(DATE_FORMAT), period_to = moment().format(DATE_FORMAT), engine = 'danger-zone', monitor_id } = req.query;

    const detections = await sequelize.query("SELECT a.id,a.name,a.machine_id,a.device_id,a.ip,a.config, b.* FROM `monitors` a RIGHT JOIN `detections` b ON a.id= b.monitor_id WHERE b.monitor_id = :monitor_id AND engine=:engine AND DATE(b.created_at) BETWEEN :period_from AND :period_to ORDER BY b.created_at DESC",
      {
        replacements: {
          period_from, period_to,
          engine, monitor_id
        },
        type: QueryTypes.SELECT
      });



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




module.exports = router;
