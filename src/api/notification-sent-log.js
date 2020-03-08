const express = require("express");

const router = express.Router();

const { NotificationSentLog } = require("../lib/db");

router.get("/", async (req, res, next) => {
  try {
    const data = await NotificationSentLog.findAll({});
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
    const data = await NotificationSentLog.findOne({where: {id: req.params.id}});
    if (!data) {
      throw new Error("No Log Found");
    }
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

router.post("/", async (req, res, next) => {
  await NotificationSentLog.create({...req.body});
  try {
    res.status(200).json({
      message: "Successfully Add Notification Sent Log"
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
    await NotificationSentLog.update({...req.body}, {where: {id: req.params.id}});
    res.status(200).json({
      message: "Successfully Update Notification Sent Log"
    });
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
    await NotificationSentLog.destroy({where: {id: req.params.id}});
    res.status(200).json({
      message: "Successfully Delete Notification Sent Log"
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err)
      .end();
  }
});

module.exports = router;