const express = require("express");
const shortid = require("shortid");
const router = express.Router();
const { Op } = require("sequelize");
const Sequelize = require("sequelize");

const { Projects, Detection, Monitor } = require("../lib/db");
const { today, week } = require("../lib/utils");

router.get('/', async (req, res) => {
  try {

    const query = {
      order: [[req.query.orderBy || "createdAt", req.query.direction || "DESC"]]
    };

    if (req.query.limit) {
      query.limit = parseInt(req.query.limit);
      if (req.query.page) {
        query.offset =
          (parseInt(req.query.page) - 1) * parseInt(req.query.limit);
      }
    }

    if (req.query.start_timestamp) {
      query.where.createdAt = {
        [Op.gte]: new Date(parseInt(req.query.start_timestamp))
      };
    }
    if (req.query.end_timestamp) {
      if (!query.where.createdAt) {
        query.where.createdAt = {
          [Op.lte]: new Date(parseInt(req.query.end_timestamp))
        };
      } else {
        query.where.createdAt = {
          ...query.where.createdAt,
          [Op.lte]: new Date(parseInt(req.query.end_timestamp))
        };
      }
    }
    const data = await Projects.findAndCountAll(query);

    res.send(data).end();


  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.get('/:id', async (req, res) => {
  try {

    const query = {
      order: [[req.query.orderBy || "createdAt", req.query.direction || "DESC"]],
      where: { id: req.params.id }
    };
    const data = await Projects.findOne(query);

    query.where = {};

    if (req.query.start_timestamp) {
      query.where.createdAt = {
        [Op.gte]: new Date(parseInt(req.query.start_timestamp))
      };
    }
    if (req.query.end_timestamp) {
      if (!query.where.createdAt) {
        query.where.createdAt = {
          [Op.lte]: new Date(parseInt(req.query.end_timestamp))
        };
      } else {
        query.where.createdAt = {
          ...query.where.createdAt,
          [Op.lte]: new Date(parseInt(req.query.end_timestamp))
        };
      }
    }

    const detectionsToday = await Detection.findAll({
      where: {
        createdAt: today()
      },
    });

    const detectionsTodayHourly = await Detection.findAll({
      where: {
        createdAt: today()
      },
      attributes: ['monitor_id', [Sequelize.fn('COUNT', 'monitor_id'), 'alerts'],
        [Sequelize.literal(`DATE(created_at)`), 'date'],
        [Sequelize.literal(`HOUR(created_at)`), 'hour']],
      group: ['monitor_id', 'date', 'hour'],
    });

    const detectionsWeek = await Detection.findAll({
      where: {
        createdAt: week()
      },
      attributes: ['monitor_id', [Sequelize.fn('COUNT', 'monitor_id'), 'alerts'],
        [Sequelize.literal(`DATE(created_at)`), 'date']],
      group: ['monitor_id', 'date'],
    });

    const detectionsWeekHourly = await Detection.findAll({
      where: {
        createdAt: week()
      },
      attributes: ['monitor_id', [Sequelize.fn('COUNT', 'monitor_id'), 'alerts'],
        [Sequelize.literal(`DATE(created_at)`), 'date'],
        [Sequelize.literal(`HOUR(created_at)`), 'hour']],
      group: ['monitor_id', 'date', 'hour'],
    });



    const detectionsByDate = await Detection.findAll({
      ...query,
      attributes: ['monitor_id', [Sequelize.fn('COUNT', 'monitor_id'), 'alerts'], [Sequelize.literal(`DATE(created_at)`), 'date']],
      group: ['monitor_id', 'date'],
    });

    const detectionsByMonitor = await Detection.findAll({
      ...query,
      group: ['monitor_id'],
      include: [
        {
          model: Monitor,
          as: "monitor",
        }
      ],
      attributes: ['monitor_id', [Sequelize.fn('COUNT', 'monitor_id'), 'alerts']],
    });
    console.log()
    if (!data) {
      throw new Error("No Project Found");
    }
    res.send({
      data, detectionsWeek, detectionsToday,
      detectionsTodayHourly,
      detectionsWeekHourly,
      detectionsByMonitor, detectionsByDate
    }).end();


  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await Projects.create({
      id: shortid(),
      ...req.body,
      quarter: `${req.body.quarter}`.toUpperCase(),
    });

    res.send(data).end();


  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .send(err)
      .end();
  }
});


router.put("/:id", async (req, res, next) => {
  try {
    delete req.body.id;
    await Projects.update({
      ...req.body,
      quarter: `${req.body.quarter}`.toUpperCase()
    }, {
      where: { id: req.params.id }
    });
    res
      .send({
        message: "Successfully Updated Project"
      })
      .status(200)
      .end();
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    let data = await Projects.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!data) {
      throw new Error("No Project Found");
    }
    res.send(data);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)
      .end();
  }
});

module.exports = router;
