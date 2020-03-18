const express = require("express");
const router = express.Router();
const moment = require('moment');
const DATE_FORMAT = 'YYYY-MM-DD';

const { sequelize } = require("../lib/db");

const { QueryTypes } = require("sequelize");
const { Projects } = require("../lib/db");
const { Op } = require("sequelize");


router.get('/camera-list', async (req, res) => {
  try {
    const { engine = 'dump-truck' } = req.query;

    let project = await Projects.findOne({
      where: {
        user_id: [req.user.username, req.user.created_by],
        [Op.and]: [{
          period_from: {
            [Op.lte]: moment().format(DATE_FORMAT)
          }
        }, {
          period_to: {
            [Op.gte]: moment().format(DATE_FORMAT)
          }
        }]
      }
    })
    if (!project) {
      project = {
        period_from: moment().format(DATE_FORMAT),
        period_to: moment().format(DATE_FORMAT),
        capacity: 1,
        target: 1
      }
    }

    const data = await sequelize.query("SELECT c.id, c.name, COUNT(*) as alerts FROM `monitors` c JOIN `detectionsview` d ON c.id=d.monitor_id where username = :username AND d.alert = '1' AND engine=:engine AND DATE(d.created_at) BETWEEN :period_from AND :period_to  GROUP BY d.monitor_id",
      {
        replacements: { period_from: project.period_from, period_to: project.period_to, engine, username: req.user["cognito:username"] },
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


router.get('/progress', async (req, res) => {
  try {

    const { period_from, period_to, engine = 'dump-truck' } = req.query;

    let project = await Projects.findOne({
      where: {
        user_id: [req.user.username, req.user.created_by],
        [Op.and]: [{
          period_from: {
            [Op.lte]: moment().format(DATE_FORMAT)
          }
        }, {
          period_to: {
            [Op.gte]: moment().format(DATE_FORMAT)
          }
        }]
      }
    })
    if (!project) {
      project = {
        period_from: moment().format(DATE_FORMAT),
        period_to: moment().format(DATE_FORMAT),
        capacity: 1,
        target: 1
      }
    }


    const { target, capacity } = project;
    const username = req.user["cognito:username"];


    const detections = await sequelize.query("SELECT COUNT(*) as count FROM detectionsview where username=:username AND engine=:engine AND DATE(created_at) BETWEEN :period_from AND :period_to ", {
      replacements: { period_from: project.period_from, period_to: project.period_to, engine, username },
      type: QueryTypes.SELECT
    });

    const activeDays = await sequelize.query("SELECT DATE(created_at) as date,COUNT(*) as count FROM detectionsview where username=:username AND DATE(created_at) BETWEEN :period_from AND :period_to AND engine=:engine GROUP by DATE(created_at)", {
      replacements: { period_from: project.period_from, period_to: project.period_to, engine, username },
      type: QueryTypes.SELECT
    });


    const detectionsByDate = await sequelize.query("SELECT a.date, coalesce(b.count,0) as count FROM dates a  LEFT JOIN (SELECT DATE(created_at) as date,COUNT(*) as count FROM detectionsview where username=:username AND engine=:engine GROUP by DATE(created_at) ) b ON a.date = b.date WHERE DATE(a.date) BETWEEN :period_from AND :period_to ORDER BY a.date", {
      replacements: { period_from, period_to, engine, username },
      type: QueryTypes.SELECT
    });

    const detectionsByHourToday = await sequelize.query("SELECT HOUR(created_at) as hour,COUNT(*) as count FROM detectionsview where username=:username AND engine=:engine AND DATE(created_at) = CURDATE() GROUP by HOUR(created_at)  ORDER BY created_at", {
      replacements: { engine, username },
      type: QueryTypes.SELECT
    });

    const cameras = await sequelize.query("SELECT c.id, c.name, COUNT(*) as alerts FROM `monitors` c JOIN `detectionsview` d ON c.id=d.monitor_id where username=:username AND d.alert = '1' AND engine=:engine GROUP BY d.monitor_id   ORDER BY monitor_id",
      {
        replacements: { engine, username },
        type: QueryTypes.SELECT
      });

    var today = moment();
    var startedBefore = moment(period_from);
    var endsBy = moment(period_to);


    const trucksTotal = detections[0].count;

    const totalRemoved = trucksTotal * capacity;

    const completedPercentage = Number(target ? totalRemoved / target * 100 : totalRemoved).toFixed(0);

    const trucksDailyAverage = activeDays.length ? trucksTotal / activeDays.length : 0;

    const dailyAverageRemoved = trucksDailyAverage * capacity;

    const remaining = target - totalRemoved || 0;


    startedBefore = today.diff(startedBefore, 'days') // 1
    endsBy = endsBy.diff(today, 'days') // 1

    const estimatedDays = dailyAverageRemoved ? remaining / dailyAverageRemoved : 'N/A';

    res
      .send({
        trucksTotal,
        activeDays: activeDays.length,
        project,
        completedPercentage: Number(completedPercentage).toFixed(0),
        estimatedDays: Number(estimatedDays > -1 ? estimatedDays : 0).toFixed(0),

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


router.get('/summary', async (req, res) => {
  try {

    const { engine = 'dump-truck' } = req.query;
    const username = req.user["cognito:username"];

    let project = await Projects.findOne({
      where: {
        user_id: [req.user.username, req.user.created_by],
        [Op.and]: [{
          period_from: {
            [Op.lte]: moment().format(DATE_FORMAT)
          }
        }, {
          period_to: {
            [Op.gte]: moment().format(DATE_FORMAT)
          }
        }]
      }
    })
    if (!project) {
      project = {
        period_from: moment().format(DATE_FORMAT),
        period_to: moment().format(DATE_FORMAT),
        capacity: 1,
        target: 1
      }
    }


    const { period_from, period_to, target, capacity } = project;

    const detections = await sequelize.query("SELECT COUNT(*) as count FROM detectionsview where username=:username AND  alert = '1' AND engine=:engine AND DATE(created_at) BETWEEN :period_from AND :period_to", {
      replacements: { period_from, period_to, engine, username },
      type: QueryTypes.SELECT
    });


    const activeDays = await sequelize.query("SELECT DATE(created_at) as date,COUNT(*) as count FROM detectionsview where username=:username AND  DATE(created_at) BETWEEN :period_from AND :period_to AND engine=:engine GROUP by DATE(created_at)", {
      replacements: { period_from: project.period_from, period_to: project.period_to, engine, username },
      type: QueryTypes.SELECT
    });


    const total = await sequelize.query("SELECT COUNT(*) as count FROM `detectionsview` WHERE username=:username AND alert = '1' AND DATE(created_at) BETWEEN :period_from AND :period_to", {
      replacements: { period_from: project.period_from, period_to: project.period_to, username },
      type: QueryTypes.SELECT
    });
    const data = await sequelize.query("SELECT engine as name, COUNT(*) as count FROM `detectionsview` WHERE username=:username AND alert = '1' group by engine;", {
      type: QueryTypes.SELECT,
      replacements: { username },
    });
    const detectionsByMonth = await sequelize.query("SELECT engine as name, COUNT(*) count,MONTH(created_at) as month,YEAR(created_at) as year FROM `detectionsview` WHERE username=:username AND alert = '1' group by engine, MONTH(created_at),YEAR(created_at)", {
      type: QueryTypes.SELECT,
      replacements: { username },
    })

    const alertDistribution = data.map(obj => {
      obj.percentage = Number(obj.count ? total[0].count / obj.count * 100 : 0).toFixed(0);
      return obj;
    })


    const detectionsByDate = await sequelize.query("SELECT DATE(created_at) as date,COUNT(*) as count FROM detectionsview where username=:username AND engine=:engine AND DATE(created_at) BETWEEN :period_from AND :period_to GROUP by DATE(created_at)", {
      replacements: { period_from, period_to, engine, username },
      type: QueryTypes.SELECT
    });

    const cameras = await sequelize.query("SELECT c.id, c.name, COUNT(*) as alerts FROM `monitors` c JOIN `detectionsview` d ON c.id=d.monitor_id where username=:username AND d.alert = '1' AND engine=:engine GROUP BY d.monitor_id",
      {
        replacements: { engine, username },
        type: QueryTypes.SELECT
      });

    var today = moment();
    var startedBefore = moment(period_from);
    var endsBy = moment(period_to);


    const trucksTotal = detections[0].count;

    const totalRemoved = trucksTotal * capacity;

    const completedPercentage = Number(target ? totalRemoved / target * 100 : totalRemoved).toFixed(0);

    const trucksDailyAverage = Number(activeDays.length ? trucksTotal / activeDays.length : 0).toFixed(0);

    const dailyAverageRemoved = trucksDailyAverage * capacity;

    const remaining = target - totalRemoved || 0;


    console.log(startedBefore.toString(), endsBy.toString())
    startedBefore = today.diff(startedBefore, 'days') // 1
    endsBy = endsBy.diff(today, 'days') // 1
    console.log(startedBefore, endsBy)

    let estimatedDays = dailyAverageRemoved ? remaining / dailyAverageRemoved : 'N/A';
    estimatedDays = Number(estimatedDays > -1 ? estimatedDays : 0).toFixed(0);

    let recommendedTrucksPerDay = Number((remaining / capacity) / endsBy).toFixed(0);

    res
      .send({
        project,
        cameras,
        remaining,
        recommendedTrucksPerDay,
        recommendedDays: endsBy,
        dailyRemovalCapacity: recommendedTrucksPerDay * capacity,
        estimatedDate: moment().add(estimatedDays, 'days'),
        estimatedDays,
        trucksTotal,
        activeDays: activeDays.length,
        totalRemoved,
        trucksDailyAverage,
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
    const username = req.user["cognito:username"];

    const { engine = 'dump-truck', period_from = yesterday, period_to = today, monitor_id = '' } = req.query;

    const detections = await sequelize.query("SELECT COUNT(*) as count FROM detectionsview where username=:username AND engine=:engine AND (:monitor_id='' OR monitor_id=:monitor_id)", {
      replacements: { engine, monitor_id, username },
      type: QueryTypes.SELECT
    });

    const detectionsToday = await sequelize.query("SELECT COUNT(*) as count FROM detectionsview where username=:username AND  engine=:engine AND DATE(created_at) = CURDATE() AND (:monitor_id='' OR monitor_id=:monitor_id) ORDER BY created_at", {
      replacements: { engine, monitor_id, username },
      type: QueryTypes.SELECT
    });


    const detectionsYesterDay = await sequelize.query("SELECT COUNT(*) as count FROM detectionsview where username=:username AND  engine=:engine AND DATE(created_at) = CURDATE()-1 AND (:monitor_id='' OR monitor_id=:monitor_id) ORDER BY created_at", {
      replacements: { engine, monitor_id, username },
      type: QueryTypes.SELECT
    });

    const detectionsWeek = await sequelize.query("SELECT COUNT(*) as count FROM detectionsview where username=:username AND  engine=:engine AND DATE(created_at) >= CURDATE()-7 AND DATE(created_at) <= CURDATE()  AND (:monitor_id='' OR monitor_id=:monitor_id) AND (:monitor_id='' OR monitor_id=:monitor_id)  ORDER BY created_at", {
      replacements: { engine, monitor_id, username },
      type: QueryTypes.SELECT
    });

    const detectionsLastWeek = await sequelize.query("SELECT COUNT(*) as count FROM detectionsview where username=:username AND  engine=:engine AND DATE(created_at) >= CURDATE()-14 AND DATE(created_at) <= CURDATE()-8  AND (:monitor_id='' OR monitor_id=:monitor_id) AND (:monitor_id='' OR monitor_id=:monitor_id) ORDER BY created_at", {
      replacements: { engine, monitor_id, username },
      type: QueryTypes.SELECT
    });


    const detectionsByHourToday = await sequelize.query("SELECT HOUR(created_at) as hour,COUNT(*) as count FROM detectionsview where username=:username AND  engine=:engine AND DATE(created_at) = CURDATE() GROUP by HOUR(created_at) AND (:monitor_id='' OR monitor_id=:monitor_id) ORDER BY created_at", {
      replacements: { engine, monitor_id, username },
      type: QueryTypes.SELECT
    });

    const detectionsByHourYesterday = await sequelize.query("SELECT HOUR(created_at) as hour,COUNT(*) as count FROM detectionsview where username=:username AND  engine=:engine AND DATE(created_at) = CURDATE()-1 GROUP by HOUR(created_at) AND (:monitor_id='' OR monitor_id=:monitor_id) ORDER BY created_at", {
      replacements: { engine, monitor_id, username },
      type: QueryTypes.SELECT
    });

    const detectionsByHourWeek = await sequelize.query("SELECT HOUR(created_at) as hour,COUNT(*) as count FROM detectionsview where username=:username AND  engine=:engine AND DATE(created_at) >= CURDATE()-7 AND DATE(created_at) <= CURDATE()-1 GROUP by HOUR(created_at) ORDER BY created_at", {
      replacements: { engine, monitor_id, username },
      type: QueryTypes.SELECT
    });



    const detectionsByHourDaily = await sequelize.query("SELECT a.date,coalesce(b.hour,0) as hour,coalesce(b.count,0) as count,coalesce(b.average,0) as average  FROM dates a  LEFT JOIN (SELECT date, hour, ROUND(AVG(count)) as average, count FROM(SELECT DATE(created_at) as date, HOUR(created_at) as hour, COUNT(*) as count FROM detectionsview WHERE username=:username AND engine = :engine AND(:monitor_id = '' OR monitor_id = :monitor_id) GROUP by DATE(created_at), HOUR(created_at)) as summary group by date ORDER BY date) b ON a.date = b.date where DATE(a.date) BETWEEN :period_from AND :period_to", {
      replacements: { period_from, period_to, engine, monitor_id, username },
      type: QueryTypes.SELECT
    });

    const cameras = await sequelize.query("SELECT c.id, c.name, COUNT(*) as alerts FROM `monitors` c JOIN `detectionsview` d ON c.id=d.monitor_id where username=:username AND d.alert = '1' AND engine=:engine GROUP BY d.monitor_id  ORDER BY monitor_id",
      {
        replacements: { engine, username },
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
    const username = req.user["cognito:username"];

    let project = await Projects.findOne({
      where: {
        user_id: [req.user.username, req.user.created_by],
        [Op.and]: [{
          period_from: {
            [Op.lte]: moment().format(DATE_FORMAT)
          }
        }, {
          period_to: {
            [Op.gte]: moment().format(DATE_FORMAT)
          }
        }]
      }
    })
    if (!project) {
      project = {
        period_from: moment().format(DATE_FORMAT),
        period_to: moment().format(DATE_FORMAT),
        capacity: 1,
        target: 1
      }
    }


    const { capacity } = project;

    const detectionsToday = await sequelize.query("SELECT COUNT(*) as count FROM detectionsview where username=:username AND engine=:engine AND DATE(created_at) = CURDATE() AND (:monitor_id='' OR monitor_id=:monitor_id)  ORDER BY created_at", {
      replacements: { engine, monitor_id, username },
      type: QueryTypes.SELECT
    });

    const detectionsYesterDay = await sequelize.query("SELECT COUNT(*) as count FROM detectionsview where username=:username AND  engine=:engine AND DATE(created_at) = CURDATE()-1  AND (:monitor_id='' OR monitor_id=:monitor_id)  ORDER BY created_at", {
      replacements: { engine, monitor_id, username },
      type: QueryTypes.SELECT
    });


    const detectionsWeek = await sequelize.query("SELECT COUNT(*) as count FROM detectionsview where username=:username AND  engine=:engine AND DATE(created_at) >= CURDATE()-7 AND DATE(created_at) <= CURDATE()  AND (:monitor_id='' OR monitor_id=:monitor_id)  ORDER BY created_at", {
      replacements: { engine, monitor_id, username },
      type: QueryTypes.SELECT
    });

    const detectionsLastWeek = await sequelize.query("SELECT COUNT(*) as count FROM detectionsview where username=:username AND engine=:engine AND DATE(created_at) >= CURDATE()-14 AND DATE(created_at) <= CURDATE()-8  AND (:monitor_id='' OR monitor_id=:monitor_id)  ORDER BY created_at", {
      replacements: { engine, monitor_id, username },
      type: QueryTypes.SELECT
    });


    const detections = await sequelize.query("SELECT COUNT(*) as count FROM detectionsview where username=:username AND engine=:engine AND DATE(created_at) BETWEEN :period_from AND :period_to  AND (:monitor_id='' OR monitor_id=:monitor_id)  ORDER BY created_at", {
      replacements: { period_from, period_to, engine, monitor_id, username },
      type: QueryTypes.SELECT
    });

    const detectionsByDate = await sequelize.query("SELECT a.date, coalesce(b.count,0) as count FROM dates a  LEFT JOIN (SELECT DATE(created_at) as date,COUNT(*) as count FROM detectionsview where username=:username AND engine=:engine AND (:monitor_id='' OR monitor_id=:monitor_id) GROUP by DATE(created_at) ) b ON a.date = b.date WHERE DATE(a.date) BETWEEN :period_from AND :period_to ORDER BY a.date", {
      replacements: { period_from, period_to, engine, monitor_id, username },
      type: QueryTypes.SELECT
    });

    const detectionsByHourToday = await sequelize.query("SELECT HOUR(created_at) as hour,COUNT(*) as count FROM detectionsview where username=:username AND engine=:engine AND DATE(created_at) = CURDATE()  AND (:monitor_id='' OR monitor_id=:monitor_id) GROUP by HOUR(created_at)  ORDER BY created_at", {
      replacements: { engine, monitor_id, username },
      type: QueryTypes.SELECT
    });

    const cameras = await sequelize.query("SELECT c.id, c.name, COUNT(*) as alerts FROM `monitors` c JOIN `detectionsview` d ON c.id=d.monitor_id where username=:username AND d.alert = '1' AND engine=:engine GROUP BY d.monitor_id   ORDER BY monitor_id",
      {
        replacements: { engine, monitor_id, username },
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



module.exports = router;
