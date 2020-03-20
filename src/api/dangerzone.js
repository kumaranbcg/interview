const express = require("express");
const router = express.Router();
const moment = require('moment');
const DATE_FORMAT = 'YYYY-MM-DD';

const { sequelize } = require("../lib/db");
const { paginate } = require("../lib/utils");

const { QueryTypes } = require("sequelize");


router.get('/machines', async (req, res) => {
  try {
    const { engine = 'danger-zone' } = req.query;
    const company_code = req.user.company_code;

    const machines = await sequelize.query("SELECT *, SUM(count) as count FROM (SELECT a.id as monitor_id,a.name,a.machine_id,a.device_id,a.ip, a.time_in, a.time_out,(SELECT COUNT(*) FROM `detectionsview`  WHERE  detection_company_code=:company_code AND alert = '1' AND engine=:engine AND monitor_id = a.id) as count FROM `monitors` a WHERE company_code=:company_code and machine_id IS NOT NULL) a GROUP BY a.machine_id ORDER BY time_in ASC, time_out ASC",
      {
        replacements: { engine, company_code },
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
    const company_code = req.user.company_code;

    const cameras = await sequelize.query("SELECT *, SUM(count) as count FROM (SELECT a.id as monitor_id,a.name,a.machine_id,a.device_id,a.ip, a.time_in, a.time_out,(SELECT COUNT(*) FROM `detectionsview`  WHERE  detection_company_code=:company_code AND alert = '1' AND engine=:engine AND monitor_id = a.id) as count FROM `monitors` a where company_code=:company_code) a GROUP BY a.monitor_id ORDER BY time_in ASC, time_out DESC",
      {
        replacements: { engine, company_code },
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
    const company_code = req.user.company_code;

    const devices = await sequelize.query("SELECT * FROM `monitors` a WHERE company_code=:company_code AND a.machine_id=:machine_id",
      {
        replacements: { machine_id, company_code },
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


    const { period_from = moment().format(DATE_FORMAT), period_to = moment().format(DATE_FORMAT), machine_id = '' } = req.query;

    const socketLogs = await sequelize.query("SELECT * FROM device_logs where (:machine_id='' OR machine_id=:machine_id) AND DATE(created_at) BETWEEN :period_from AND :period_to",
      {
        replacements: { period_from, period_to, machine_id },
        type: QueryTypes.SELECT
      });

    const socketLogsHourly = await sequelize.query("SELECT * FROM device_logs_hourly where  (:machine_id='' OR machine_id=:machine_id) AND DATE(created_at) BETWEEN :period_from AND :period_to",
      {
        replacements: { period_from, period_to, machine_id },
        type: QueryTypes.SELECT
      });

    const socketLogsDaily = await sequelize.query("SELECT * FROM device_logs_daily_all where  (:machine_id='' OR machine_id IS NULL OR  machine_id=:machine_id) AND date BETWEEN :period_from AND :period_to",
      {
        replacements: { period_from, period_to, machine_id },
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
    const { period_from, period_to, engine = 'danger-zone', monitor_id, page_size = 10, page_number = 1 } = req.query;
    const company_code = req.user.company_code;

    if (period_from && period_to) {
      detections = await sequelize.query("SELECT a.id,a.name,a.machine_id,a.device_id,a.ip,a.config, b.* FROM `monitors` a RIGHT JOIN `detectionsview`  b ON a.id= b.monitor_id WHERE detection_company_code=:company_code AND b.alert = '1' AND b.monitor_id = :monitor_id AND engine=:engine AND DATE(b.created_at) BETWEEN :period_from AND :period_to AND video_url IS NOT NULL ORDER BY b.created_at DESC",
        {
          replacements: {
            period_from, period_to,
            engine, monitor_id,
            company_code
          },
          type: QueryTypes.SELECT
        });
    } else if (monitor_id) {
      detections = await sequelize.query("SELECT a.id,a.name,a.machine_id,a.device_id,a.ip,a.config, b.* FROM `monitors` a RIGHT JOIN `detectionsview`  b ON a.id= b.monitor_id WHERE detection_company_code=:company_code AND b.alert = '1' AND b.monitor_id = :monitor_id AND engine=:engine AND video_url IS NOT NULL ORDER BY b.created_at DESC",
        {
          replacements: {
            engine, monitor_id, company_code
          },
          type: QueryTypes.SELECT
        });

    } else {
      detections = await sequelize.query("SELECT a.id,a.name,a.machine_id,a.device_id,a.ip,a.config, b.* FROM `monitors` a RIGHT JOIN `detectionsview`  b ON a.id= b.monitor_id WHERE detection_company_code=:company_code AND b.alert = '1' AND engine=:engine AND video_url IS NOT NULL ORDER BY b.created_at DESC",
        {
          replacements: {
            engine, company_code
          },
          type: QueryTypes.SELECT
        });

    }

    res
      .send({
        detections: paginate(detections, page_size, page_number),
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
    const company_code = req.user.company_code;

    const detections = await sequelize.query("SELECT * FROM `detectionsview`  WHERE  detection_company_code=:company_code AND  image_url IS NOT NULL AND monitor_id = :monitor_id and image_url IS NOT NULL ORDER BY created_at DESC LIMIT 1",
      {
        replacements: {
          monitor_id,
          company_code
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
    const company_code = req.user.company_code;

    const detectionsDaily = await sequelize.query("SELECT * FROM detections_daily_camera WHERE date BETWEEN :period_from AND :period_to ORDER BY date ASC",
      {
        replacements: {
          period_from, period_to,
          machine_id,
          monitor_id,
          engine, company_code
        },
        type: QueryTypes.SELECT
      });



    const detectionsHourly = await sequelize.query("SELECT * FROM detections_hourly WHERE date = CURDATE()",
      {
        replacements: {
          period_from, period_to,
          machine_id, monitor_id,
          engine, company_code
        },
        type: QueryTypes.SELECT
      });


    const output = {};
    detectionsDaily.forEach(obj => {
      if (!output[obj.date]) {
        output[obj.date] = {}
      }
      if (
        (monitor_id ? obj.monitor_id === monitor_id : true) &&
        (machine_id ? obj.machine_id === machine_id : true) &&
        (engine ? obj.engine === engine : true) &&
        (company_code ? obj.company_code === company_code : true)
      ) {
        output[obj.date][obj.monitor_id] = obj.count;
      }
    })

    const output_hourly = {}
    detectionsHourly.forEach(obj => {
      if (!output_hourly[`${obj.hour}:00`]) {
        output_hourly[`${obj.hour}:00`] = {}
      }
      if (
        (monitor_id ? obj.monitor_id === monitor_id : true) &&
        (machine_id ? obj.machine_id === machine_id : true) &&
        (engine ? obj.engine === engine : true) &&
        (company_code ? obj.company_code === company_code : true)
      ) {
        output_hourly[`${obj.hour}:00`][obj.monitor_id] = obj.count;
      }
    })

    const result1 = []
    const result2 = []

    Object.keys(output).forEach(key => {
      result1.push({
        date: key,
        sum: monitor_id ? output[key][monitor_id] : undefined,
        ...output[key]
      })
    })

    Object.keys(output_hourly).forEach(key => {
      result2.push({
        hour: key,
        sum: monitor_id ? output_hourly[key][monitor_id] : undefined,
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
