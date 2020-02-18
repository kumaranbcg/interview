const express = require("express");
const router = express.Router();
const moment = require('moment');
const DATE_FORMAT = 'YYYY-MM-DD';

const { sequelize } = require("../lib/db");

const { QueryTypes } = require("sequelize");


router.get('/camera-list', async (req, res) => {
  try {
    const { engine = 'dump-truck' } = req.query;

    const data = await sequelize.query("SELECT c.id, c.name, COUNT(*) as alerts FROM `monitors` c JOIN `detections` d ON c.id=d.monitor_id where engine=:engine GROUP BY d.monitor_id",
      {
        replacements: { engine },
        type: QueryTypes.SELECT
      });

    res
      .send(data)
      .status(200)
      .end();

  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send({
        message: err.message
      })
      .end();
  }
});

router.get('/summary', async (req, res) => {
  try {

    const { engine = 'dump-truck' } = req.query;

    let project = await sequelize.query("SELECT * FROM projects where period_from <= CURDATE() AND period_to >= CURDATE()", {
      type: QueryTypes.SELECT
    });

    project = project[0];

    if (!project) {
      project = {
        period_from: moment().format(DATE_FORMAT),
        period_to: moment().format(DATE_FORMAT),
        capacity: 1,
        target: 1
      }
    }
    const { period_from, period_to, target, capacity } = project;

    const detections = await sequelize.query("SELECT COUNT(*) as count FROM detections where engine=:engine AND created_at BETWEEN :period_from AND :period_to", {
      replacements: { period_from, period_to, engine },
      type: QueryTypes.SELECT
    });

    const total = await sequelize.query("SELECT COUNT(*) as count FROM `detections`", { type: QueryTypes.SELECT });
    const data = await sequelize.query("SELECT engine as name, COUNT(*) as count FROM `detections` group by engine;", { type: QueryTypes.SELECT });
    const detectionsByMonth = await sequelize.query("SELECT engine as name, COUNT(*) count,MONTH(created_at) as month,YEAR(created_at) as year FROM `detections` group by engine, MONTH(created_at),YEAR(created_at)", { type: QueryTypes.SELECT })

    const alertDistribution = data.map(obj => {
      obj.percentage = Number(obj.count ? total[0].count / obj.count * 100 : 0).toFixed(0);
      return obj;
    })


    const detectionsByDate = await sequelize.query("SELECT DATE(created_at) as date,COUNT(*) as count FROM detections where engine=:engine AND created_at BETWEEN :period_from AND :period_to GROUP by DATE(created_at)", {
      replacements: { period_from, period_to, engine },
      type: QueryTypes.SELECT
    });

    const cameras = await sequelize.query("SELECT c.id, c.name, COUNT(*) as alerts FROM `monitors` c JOIN `detections` d ON c.id=d.monitor_id where engine=:engine GROUP BY d.monitor_id",
      {
        replacements: { engine },
        type: QueryTypes.SELECT
      });

    var today = moment();
    var startedBefore = moment([period_from]);
    var endsBy = moment([period_to]);


    const trucksTotal = detections[0].count;

    const totalRemoved = trucksTotal * capacity;

    const completedPercentage = Number(target ? totalRemoved / target * 100 : totalRemoved).toFixed(0);

    const trucksDailyAverage = detectionsByDate.length ? trucksTotal / detectionsByDate.length : trucksTotal;

    const dailyAverageRemoved = trucksDailyAverage * capacity;

    const remaining = target - totalRemoved || "0";


    startedBefore = today.diff(startedBefore, 'days') // 1
    endsBy = endsBy.diff(today, 'days') // 1

    const estimatedDays = remaining / dailyAverageRemoved;

    res
      .send({
        project,
        cameras,
        remaining,
        estimatedDays: Number(estimatedDays).toFixed(0),
        trucksTotal,
        totalRemoved,
        trucksDailyAverage: Number(trucksDailyAverage).toFixed(0),
        dailyAverageRemoved: Number(dailyAverageRemoved).toFixed(0),
        completedPercentage: Number(completedPercentage).toFixed(0),
        detectionsByMonth,
        alertDistribution,
        total: total[0].count
      })
      .status(200)
      .end();

  } catch (err) {
    res
      .status(400)
      .send({
        message: err.message
      })
      .end();
  }
});


router.get('/truck-activity', async (req, res) => {
  try {
    var today = moment().format(DATE_FORMAT)
    var yesterday = moment().subtract(1, 'days').format(DATE_FORMAT)

    const { engine = 'dump-truck', period_from = yesterday, period_to = today, monitor_id = '' } = req.query;

    const detections = await sequelize.query("SELECT COUNT(*) as count FROM detections where engine=:engine AND (:monitor_id='' OR monitor_id=:monitor_id)", {
      replacements: { engine, monitor_id },
      type: QueryTypes.SELECT
    });

    const detectionsToday = await sequelize.query("SELECT COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) = CURDATE() AND (:monitor_id='' OR monitor_id=:monitor_id) ORDER BY created_at", {
      replacements: { engine, monitor_id },
      type: QueryTypes.SELECT
    });


    const detectionsYesterDay = await sequelize.query("SELECT COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) = CURDATE()-1 AND (:monitor_id='' OR monitor_id=:monitor_id) ORDER BY created_at", {
      replacements: { engine, monitor_id },
      type: QueryTypes.SELECT
    });

    const detectionsWeek = await sequelize.query("SELECT COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) >= CURDATE()-7 AND DATE(created_at) <= CURDATE()  AND (:monitor_id='' OR monitor_id=:monitor_id) AND (:monitor_id='' OR monitor_id=:monitor_id)  ORDER BY created_at", {
      replacements: { engine, monitor_id },
      type: QueryTypes.SELECT
    });

    const detectionsLastWeek = await sequelize.query("SELECT COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) >= CURDATE()-14 AND DATE(created_at) <= CURDATE()-8  AND (:monitor_id='' OR monitor_id=:monitor_id) AND (:monitor_id='' OR monitor_id=:monitor_id) ORDER BY created_at", {
      replacements: { engine, monitor_id },
      type: QueryTypes.SELECT
    });


    const detectionsByHourToday = await sequelize.query("SELECT HOUR(created_at) as hour,COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) = CURDATE() GROUP by HOUR(created_at) AND (:monitor_id='' OR monitor_id=:monitor_id) ORDER BY created_at", {
      replacements: { engine, monitor_id },
      type: QueryTypes.SELECT
    });

    const detectionsByHourYesterday = await sequelize.query("SELECT HOUR(created_at) as hour,COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) = CURDATE()-1 GROUP by HOUR(created_at) AND (:monitor_id='' OR monitor_id=:monitor_id) ORDER BY created_at", {
      replacements: { engine, monitor_id },
      type: QueryTypes.SELECT
    });

    const detectionsByHourWeek = await sequelize.query("SELECT HOUR(created_at) as hour,COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) >= CURDATE()-7 AND DATE(created_at) <= CURDATE()-1 GROUP by HOUR(created_at) ORDER BY created_at", {
      replacements: { engine, monitor_id },
      type: QueryTypes.SELECT
    });



    const detectionsByHourDaily = await sequelize.query("SELECT a.date,coalesce(b.hour,0) as hour,coalesce(b.count,0) as count,coalesce(b.average,0) as average  FROM dates a  LEFT JOIN (SELECT date, hour, ROUND(AVG(count)) as average, count FROM(SELECT DATE(created_at) as date, HOUR(created_at) as hour, COUNT(*) as count FROM detections WHERE engine = :engine AND(:monitor_id = '' OR monitor_id = :monitor_id) GROUP by DATE(created_at), HOUR(created_at)) as summary group by date ORDER BY date) b ON a.date = b.date where a.date BETWEEN :period_from AND :period_to", {
      replacements: { period_from, period_to, engine, monitor_id },
      type: QueryTypes.SELECT
    });

    const cameras = await sequelize.query("SELECT c.id, c.name, COUNT(*) as alerts FROM `monitors` c JOIN `detections` d ON c.id=d.monitor_id where engine=:engine GROUP BY d.monitor_id  ORDER BY monitor_id",
      {
        replacements: { engine },
        type: QueryTypes.SELECT
      });



    const trucksTotal = detections[0].count;
    const trucksTotalToday = detectionsToday[0].count;
    const trucksTotalYesterday = detectionsYesterDay[0].count;
    const trucksTotalWeek = detectionsWeek[0].count;
    const trucksTotalLastWeek = detectionsLastWeek[0].count;

    const perHour = detectionsByHourToday.reduce((acc, curr) => {
      return acc + curr.count;
    }, 0) / detectionsByHourToday.length || 0;
    const perHourYesterday = detectionsByHourYesterday.reduce((acc, curr) => {
      return acc + curr.count;
    }, 0) / detectionsByHourYesterday.length || 0;
    const perHourWeek = detectionsByHourWeek.reduce((acc, curr) => {
      return acc + curr.count;
    }, 0) / detectionsByHourWeek.length || 0;

    res
      .send({
        trucksByHourDaily: detectionsByHourDaily,
        trucksByHourToday: detectionsByHourToday,
        cameras,
        trucksTotal,
        trucksTotalToday,
        trucksTotalYesterday,
        trucksTotalWeek,
        trucksTotalLastWeek,

        trucksTotalYesterdayPercentage: (trucksTotalToday ? (trucksTotalYesterday / trucksTotalToday * 100) : trucksTotalYesterday).toFixed(0),
        trucksTotalWeekPercentage: (trucksTotalWeek ? (trucksTotalLastWeek / trucksTotalWeek * 100) : trucksTotalLastWeek).toFixed(0),

        perHourToday: Number(perHour).toFixed(0),
        perHourYesterday: Number(perHourYesterday).toFixed(0),
        perHourWeek: Number(perHourWeek).toFixed(0),
        perHourYesterdayPercentage: (perHour ? perHourYesterday / perHour * 100 : perHourYesterday).toFixed(0),
        perHourWeekPercentage: (perHour ? perHourWeek / perHour * 100 : perHourWeek).toFixed(0)
      })
      .status(200)
      .end();

  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send({
        message: err.message
      })
      .end();
  }
});


router.get('/soil-removed', async (req, res) => {
  try {

    const { period_from, period_to, monitor_id = '', engine = 'dump-truck' } = req.query;

    let project = await sequelize.query("SELECT * FROM projects where period_from <= :period_from AND period_to >= :period_to", {
      replacements: { period_from, period_to },
      type: QueryTypes.SELECT
    });

    project = project[0];

    if (!project) {
      project = {
        period_from,
        period_to,
        capacity: 1,
        target: 1
      }
    }
    const { capacity } = project;

    const detectionsToday = await sequelize.query("SELECT COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) = CURDATE() AND (:monitor_id='' OR monitor_id=:monitor_id)  ORDER BY created_at", {
      replacements: { engine, monitor_id },
      type: QueryTypes.SELECT
    });

    const detectionsYesterDay = await sequelize.query("SELECT COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) = CURDATE()-1  AND (:monitor_id='' OR monitor_id=:monitor_id)  ORDER BY created_at", {
      replacements: { engine, monitor_id },
      type: QueryTypes.SELECT
    });


    const detectionsWeek = await sequelize.query("SELECT COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) >= CURDATE()-7 AND DATE(created_at) <= CURDATE()  AND (:monitor_id='' OR monitor_id=:monitor_id)  ORDER BY created_at", {
      replacements: { engine, monitor_id },
      type: QueryTypes.SELECT
    });

    const detectionsLastWeek = await sequelize.query("SELECT COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) >= CURDATE()-14 AND DATE(created_at) <= CURDATE()-8  AND (:monitor_id='' OR monitor_id=:monitor_id)  ORDER BY created_at", {
      replacements: { engine, monitor_id },
      type: QueryTypes.SELECT
    });


    const detections = await sequelize.query("SELECT COUNT(*) as count FROM detections where engine=:engine AND created_at BETWEEN :period_from AND :period_to  AND (:monitor_id='' OR monitor_id=:monitor_id)  ORDER BY created_at", {
      replacements: { period_from, period_to, engine, monitor_id },
      type: QueryTypes.SELECT
    });

    const detectionsByDate = await sequelize.query("SELECT a.date, coalesce(b.count,0) as count FROM dates a  LEFT JOIN (SELECT DATE(created_at) as date,COUNT(*) as count FROM detections where engine=:engine AND (:monitor_id='' OR monitor_id=:monitor_id) GROUP by DATE(created_at) ) b ON a.date = b.date WHERE a.date BETWEEN :period_from AND :period_to ORDER BY a.date", {
      replacements: { period_from, period_to, engine, monitor_id },
      type: QueryTypes.SELECT
    });

    const detectionsByHourToday = await sequelize.query("SELECT HOUR(created_at) as hour,COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) = CURDATE()  AND (:monitor_id='' OR monitor_id=:monitor_id) GROUP by HOUR(created_at)  ORDER BY created_at", {
      replacements: { engine, monitor_id },
      type: QueryTypes.SELECT
    });

    const cameras = await sequelize.query("SELECT c.id, c.name, COUNT(*) as alerts FROM `monitors` c JOIN `detections` d ON c.id=d.monitor_id where engine=:engine GROUP BY d.monitor_id   ORDER BY monitor_id",
      {
        replacements: { engine, monitor_id },
        type: QueryTypes.SELECT
      });


    const trucksTotal = detections[0].count;
    const trucksTotalToday = detectionsToday[0].count;
    const trucksTotalYesterday = detectionsYesterDay[0].count;
    const trucksTotalWeek = detectionsWeek[0].count;
    const trucksTotalLastWeek = detectionsLastWeek[0].count;

    console.error(trucksTotalYesterday, trucksTotalToday)

    res
      .send({
        project,
        cameras,

        trucksTotalYesterday,
        trucksTotalToday,
        trucksTotalLastWeek,
        trucksTotalWeek,

        trucksTotalYesterdayPercentage: (trucksTotalToday ? (trucksTotalYesterday / trucksTotalToday * 100) : trucksTotalYesterday).toFixed(0),
        trucksTotalWeekPercentage: (trucksTotalWeek ? (trucksTotalLastWeek / trucksTotalWeek * 100) : trucksTotalLastWeek).toFixed(0),

        totalRemoved: trucksTotal * capacity,
        todayRemoved: trucksTotalToday * capacity,

        detectionsByDate,
        detectionsByHourToday: detectionsByHourToday.map(obj => {
          obj.removed = capacity ? obj.count * capacity : obj.count;
          return obj;
        }),
        trucksToday: detectionsToday[0].count,
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
})



router.get('/progress', async (req, res) => {
  try {

    const { period_from, period_to, engine = 'dump-truck' } = req.query;

    let project = await sequelize.query("SELECT * FROM projects where period_from <= :period_from AND period_to >= :period_to", {
      replacements: { period_from, period_to },
      type: QueryTypes.SELECT
    });

    project = project[0];

    if (!project) {
      project = {
        period_from: moment().format(DATE_FORMAT),
        period_to: moment().format(DATE_FORMAT),
        capacity: 1,
        target: 1
      }
    }
    const { target, capacity } = project;

    const detections = await sequelize.query("SELECT COUNT(*) as count FROM detections where engine=:engine AND created_at BETWEEN :period_from AND :period_to ", {
      replacements: { period_from, period_to, engine },
      type: QueryTypes.SELECT
    });

    const detectionsByDate = await sequelize.query("SELECT a.date, coalesce(b.count,0) as count FROM dates a  LEFT JOIN (SELECT DATE(created_at) as date,COUNT(*) as count FROM detections where engine=:engine GROUP by DATE(created_at) ) b ON a.date = b.date WHERE a.date BETWEEN :period_from AND :period_to ORDER BY a.date", {
      replacements: { period_from, period_to, engine },
      type: QueryTypes.SELECT
    });

    const detectionsByHourToday = await sequelize.query("SELECT HOUR(created_at) as hour,COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) = CURDATE() GROUP by HOUR(created_at)  ORDER BY created_at", {
      replacements: { engine },
      type: QueryTypes.SELECT
    });

    const cameras = await sequelize.query("SELECT c.id, c.name, COUNT(*) as alerts FROM `monitors` c JOIN `detections` d ON c.id=d.monitor_id where engine=:engine GROUP BY d.monitor_id   ORDER BY monitor_id",
      {
        replacements: { engine },
        type: QueryTypes.SELECT
      });

    var today = moment();
    var startedBefore = moment([period_from]);
    var endsBy = moment([period_to]);


    const trucksTotal = detections[0].count;

    const totalRemoved = trucksTotal * capacity;

    const completedPercentage = Number(target ? totalRemoved / target * 100 : totalRemoved).toFixed(0);

    const trucksDailyAverage = trucksTotal / detectionsByDate.length || 1;

    const dailyAverageRemoved = trucksDailyAverage * capacity;

    const remaining = target - totalRemoved || "0";


    startedBefore = today.diff(startedBefore, 'days') // 1
    endsBy = endsBy.diff(today, 'days') // 1

    const estimatedDays = remaining / dailyAverageRemoved;

    res
      .send({
        project,
        completedPercentage: Number(completedPercentage).toFixed(0),
        estimatedDays: Number(estimatedDays).toFixed(0),

        detectionsByHourToday: detectionsByHourToday.map(obj => {
          obj.percentage = Number(capacity ? (obj.count * capacity / target) * 100 : obj.count).toFixed(0)
          return obj;
        }),

        cameras,
        detectionsByDate: detectionsByDate.map(obj => {
          obj.percentage = Number((obj.count * capacity / target) * 100).toFixed(0)
          return obj;
        })
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



router.get('/devices', async (req, res) => {
  try {

    const devices = await sequelize.query("SELECT a.id,a.name,a.machine_id,a.device_id,a.ip,b.time_in, b.time_out FROM `monitors` a LEFT JOIN (SELECT * FROM `socket_log` ORDER BY created_at DESC) b on a.id= b.camera_id",
      {
        // replacements: { engine },
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


    const { period_from = moment().format(DATE_FORMAT), period_to = moment().format(DATE_FORMAT), engine = 'danger-zone' } = req.query;

    const socketLogs = await sequelize.query("SELECT s.*,m.name, TIMESTAMPDIFF(MINUTE,s.time_in,s.time_out) as active_time_minutes FROM `socket_log` s LEFT JOIN `monitors` m ON s.camera_id=m.id  where s.camera_id IS NOT NULL AND s.created_at BETWEEN :period_from AND :period_to ORDER BY s.created_at DESC",
      {
        replacements: { period_from, period_to },
        type: QueryTypes.SELECT
      });



    res
      .send({
        socketLogs,
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


    const { period_from = moment().format(DATE_FORMAT), period_to = moment().format(DATE_FORMAT), engine = 'danger-zone' } = req.query;

    const detections = await sequelize.query("SELECT a.id,a.name,a.machine_id,a.device_id,a.ip,a.config, b.* FROM `monitors` a RIGHT JOIN `detections` b ON a.id= b.monitor_id WHERE engine=:engine AND s.created_at BETWEEN :period_from AND :period_to ORDER BY s.created_at DESC",
      {
        replacements: { period_from, period_to,engine },
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
