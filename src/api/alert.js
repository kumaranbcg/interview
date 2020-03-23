const express = require("express");
const router = express.Router();
const uuidv4 = require("uuid/v4");
const { Alert, Monitor } = require("../lib/db");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  console.log("getting alert")
  try {
    let query = {
      offset: 0,
      where: {},
      include: [
        {
          model: Monitor,
          required: true,
          as: "monitor",
          where: {
            company_code: req.user.company_code,
            ...(req.query.monitor_id ? { id: req.query.monitor_id } : {})
          }
        }
      ]
    };

    if (req.query.monitor_id) {
      query.monitor_id = req.query.monitor_id;
    }

    if (req.query.limit) {
      query.limit = Number.parseInt(req.query.limit)
      if (req.query.page) {
        query.offset = (Math.min(req.query.page) - 1) * req.query.limit;
      }
    }

    if (req.query.orderBy) {
      query.order = [[req.query.orderBy]];
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

    const data = await Alert.findAndCountAll(query);

    res
      .send(data)
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

router.get("/:id", async (req, res, next) => {
  try {
    var data = await Alert.findOne({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json(data);
  } catch (err) {
    res
      .send(err)
      .status(400)
      .end();
  }
});

router.post("/", async (req, res, next) => {
  try {
    // Create Log In Our Database
    const id = uuidv4();
    await Alert.create({
      id,
      ...req.body
    });

    console.log(req.body);

    res.status(200).json({
      id: id,
      message: "Successfully Added Alert"
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    await Alert.update(req.body, {
      where: { id: req.params.id }
    });
    res.status(200).json({
      message: "Successfully Updated"
    });
  } catch (err) {
    res
      .status(400)
      .send(err)
      .end();
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Alert.destroy({
      where: {
        id: req.params.id
      }
    });
    res
      .json({
        message: "Successfully Deleted Alert"
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

module.exports = router;
