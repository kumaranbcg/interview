const express = require("express");
const router = express.Router();
const moment = require('moment');
const DATE_FORMAT = 'YYYY-MM-DD';

const { sequelize } = require("../lib/db");

const { QueryTypes } = require("sequelize");


router.get('/', async (req, res) => {
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


module.exports = router;
