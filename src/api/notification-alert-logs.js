const express = require("express");
const router = express.Router();
const { NotificationLogs } = require("../lib/db");
const uuidv4 = require("uuid/v4");

router.post("/", async (req, res, next) => {
  try {
    // Create Log In Our Database
    const id = uuidv4();
    await NotificationLogs.create({
      id,
      ...req.body
    });

    console.log(req.body);

    res.status(200).json({
      id: id,
      message: "Successfully Added Notification alert logs"
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)
      .end();
  }
});

//get all companies
router.get("/", async (req, res) => {
  try {
    let query = {
      offset: 0,
      where: {}
    };
    const data = await NotificationLogs.findAll(query);
    res
      .send(data)
      .status(200)
      .end();
  } catch (err) {
    console.log(err);
    res
      .send(err)
      .status(400)
      .end();
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    var data = await NotificationLogs.findOne({
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
module.exports = router;