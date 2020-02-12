const express = require("express");
const shortid = require("shortid");
const router = express.Router();
const Sequelize = require("sequelize");
const moment = require('moment');
const DATE_FORMAT = 'YYYY-MM-DD';

const { Alert, sequelize } = require("../lib/db");

const { Op, QueryTypes } = require("sequelize");

const { Projects, Detection, Monitor } = require("../lib/db");

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
      .send(err)
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

    const completedPercentage = Number(totalRemoved / target * 100).toFixed(0);

    const trucksDailyAverage = trucksTotal / detectionsByDate.length || 1;

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
        dailyAverageRemoved,
        completedPercentage: Number(completedPercentage).toFixed(0),
      })
      .status(200)
      .end();

  } catch (err) {
    res
      .status(400)
      .send(err)
      .end();
  }
});


router.get('/truck-activity', async (req, res) => {
  try {
    var today = moment().format(DATE_FORMAT)
    var yesterday = moment().subtract(1, 'days').format(DATE_FORMAT)
    var week = moment().subtract(7, 'days').format(DATE_FORMAT)

    const { engine = 'dump-truck', period_from = yesterday, period_to = today } = req.query;

    const detections = await sequelize.query("SELECT COUNT(*) as count FROM detections where engine=:engine", {
      replacements: { engine },
      type: QueryTypes.SELECT
    });

    const detectionsToday = await sequelize.query("SELECT COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) = CURDATE()", {
      replacements: { engine },
      type: QueryTypes.SELECT
    });


    const detectionsYesterDay = await sequelize.query("SELECT COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) = CURDATE()-1", {
      replacements: { engine },
      type: QueryTypes.SELECT
    });


    const detectionsWeek = await sequelize.query("SELECT COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) >= CURDATE()-7 AND DATE(created_at) <= CURDATE()-1 ", {
      replacements: { engine },
      type: QueryTypes.SELECT
    });

    const detectionsByHourToday = await sequelize.query("SELECT HOUR(created_at) as hour,COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) = CURDATE() GROUP by HOUR(created_at)", {
      replacements: { engine },
      type: QueryTypes.SELECT
    });

    const detectionsByHourYesterday = await sequelize.query("SELECT HOUR(created_at) as hour,COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) = CURDATE()-1 GROUP by HOUR(created_at)", {
      replacements: { engine },
      type: QueryTypes.SELECT
    });

    const detectionsByHourWeek = await sequelize.query("SELECT HOUR(created_at) as hour,COUNT(*) as count FROM detections where engine=:engine AND DATE(created_at) >= CURDATE()-7 AND DATE(created_at) <= CURDATE()-1 GROUP by HOUR(created_at)", {
      replacements: { engine },
      type: QueryTypes.SELECT
    });



    const detectionsByHourDaily = await sequelize.query("SELECT date, hour, AVG(count) as average, count FROM (SELECT DATE(created_at) as date,HOUR(created_at) as hour,COUNT(*) as count FROM detections where engine=:engine  AND created_at BETWEEN :period_from AND :period_to GROUP by DATE(created_at),HOUR(created_at)) as summary group by date", {
      replacements: { period_from, period_to, engine },
      type: QueryTypes.SELECT
    });

    const cameras = await sequelize.query("SELECT c.id, c.name, COUNT(*) as alerts FROM `monitors` c JOIN `detections` d ON c.id=d.monitor_id where engine=:engine GROUP BY d.monitor_id",
      {
        replacements: { engine },
        type: QueryTypes.SELECT
      });



    const trucksTotal = detections[0].count;
    const trucksTotalToday = detectionsToday[0].count;
    const trucksTotalYesterday = detectionsYesterDay[0].count;
    const trucksTotalWeek = detectionsWeek[0].count;

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
        trucksTotalYesterdayPercentage: (trucksTotalYesterday / trucksTotalToday * 100).toFixed(0),
        trucksTotalWeekPercentage: (trucksTotalWeek / trucksTotalToday * 100).toFixed(0),
        perHourToday: Number(perHour).toFixed(0),
        perHourYesterday: perHourYesterday,
        perHourWeek: perHourWeek,
        perHourYesterdayPercentage: (perHourYesterday / perHour * 100).toFixed(0),
        perHourWeekPercentage: (perHourWeek / perHour * 100).toFixed(0)
      })
      .status(200)
      .end();

  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.get('/alert-distribution', async (req, res) => {
  try {

    const total = await sequelize.query("SELECT COUNT(*) as count FROM `detections`", { type: QueryTypes.SELECT });
    const data = await sequelize.query("SELECT engine as name, COUNT(*) as count FROM `detections` group by engine;", { type: QueryTypes.SELECT });
    const detectionsByMonth = await sequelize.query("SELECT engine as name, COUNT(*) count,MONTH(created_at) as month,YEAR(created_at) as year FROM `detections` group by engine, MONTH(created_at),YEAR(created_at)", { type: QueryTypes.SELECT })

    const alertDistribution = data.map(obj => {
      obj.percentage = total[0].count / obj.count * 100;
      return obj;
    })


    res
      .send({
        alertDistribution,
        detectionsByMonth,
        total: total[0].count
      })
      .status(200)
      .end();

  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send(err)
      .end();
  }
});

module.exports = router;
