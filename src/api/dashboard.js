const express = require("express");
const shortid = require("shortid");
const router = express.Router();
const Sequelize = require("sequelize");
const moment = require('moment');
const DATE_FORMAT = 'YYYY-MM-DD';

const { Alert, sequelize } = require("../lib/db");
const { today, yesterday } = require("../lib/utils");

const { Op, QueryTypes } = require("sequelize");

const { Projects, Detection, Monitor } = require("../lib/db");

router.get('/camera-list', async (req, res) => {
  try {

    const data = await sequelize.query("SELECT c.id, c.name, COUNT(*) as alerts FROM `monitors` c JOIN `detections` d ON c.id=d.monitor_id GROUP BY d.monitor_id", { type: QueryTypes.SELECT });

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

router.get('/summary/:id', async (req, res) => {
  try {

    const { id } = req.params;
    const { engine = 'dump-truck' } = req.query;

    const project = await Projects.findOne({
      where: {
        id
      }
    });

    const { period_from, period_to, target, capacity } = project;

    const detections = await sequelize.query("SELECT COUNT(*) as count FROM detections where engine=:engine AND created_at BETWEEN :period_from AND :period_to", {
      replacements: { period_from, period_to, engine },
      type: QueryTypes.SELECT
    });

    const detectionsByDate = await sequelize.query("SELECT DATE(created_at) as date,COUNT(*) as count FROM detections where engine=:engine AND created_at BETWEEN :period_from AND :period_to GROUP by DATE(created_at)", {
      replacements: { period_from, period_to, engine },
      type: QueryTypes.SELECT
    });

    const totalDetections = detections.count;;

    const totalRemoved = totalDetections * capacity;

    const completedPercentage = totalRemoved / target * 100;

    res
      .send({
        project,
        trucks: totalDetections,
        detectionsByDate,
        totalRemoved,
        completedPercentage
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
