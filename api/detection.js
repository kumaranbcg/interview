const express = require("express");
const router = express.Router();
const Detection = require("../models/detection.js");

router.get("/", async (req, res) => {
  // Get All For User
  try {
    let interval = req.query.interval;
    let limit = 7;

    if (interval === "perfiveminute") {
      limit = 7 * 5 * 30;
    } else if (interval === "hourly") {
      limit = 7 * 60 * 30;
    }

    const data = await Detection.findAll({
      limit,
      where: {
        monitor_id: req.query.monitor_id
      },
      order: [["createdAt", "ASC"]]
    });
    let returnData = data.map(item => {
      return {
        numberOfPerson: item.numberOfPerson,
        numberOfSmoker: item.numberOfSmoker
      };
    });

    if (data.length < 7) {
      for (var i = 0; i < 7 - data.length; i++) {
        returnData.unshift({
          numberOfPerson: 0,
          numberOfSmoker: 0
        });
      }
    }
    res.send(returnData);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    var data = await Detection.findOne({
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

router.put("/:id", async (req, res, next) => {
  try {
    await Detection.update(req.body, {
      where: { id: req.params.id }
    });
    res.status(200).json({
      message: "Successfully Updated"
    });
  } catch (err) {
    res
      .send(err)
      .status(400)
      .end();
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    res
      .send("WIP")
      .status(200)
      .end();
  } catch (err) {
    res
      .send(err)
      .status(400)
      .end();
  }
});

module.exports = router;
