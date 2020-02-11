const express = require("express");
const shortid = require("shortid");
const router = express.Router();
const Sequelize = require("sequelize");

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

router.get('/alert-distribution', async (req, res) => {
  try {

    const total = await sequelize.query("SELECT COUNT(*) as count FROM `detections`", { type: QueryTypes.SELECT });
    const data = await sequelize.query("SELECT engine as name, COUNT(*) as count FROM `detections` group by engine;", { type: QueryTypes.SELECT });

    const output = data.map(obj => {
      obj.percentage = total[0].count / obj.count * 100;
      return obj;
    })
    res
      .send(output)
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
