const express = require("express");
const router = express.Router();

const { Configuration, Alert, Monitor } = require("../lib/db");

const io = require("../io")();

router.get("/", async (req, res) => {
  try {
    const data = await Monitor.findAll();
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

router.get("/:id", async (req, res) => {
  try {
    let data = await Monitor.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!data) {
      throw new Error("No Monitor Found");
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

router.get("/:id/engine/:engine", async (req, res) => {
  try {
    const monitor = await Monitor.findOne({
      where: {
        id: req.params.id
      }
    });

    const config = await Configuration.findOne({
      where: {
        monitor_id: req.params.id,
        engine: req.params.engine
      }
    });

    const alerts = await Alert.findAll({
      where: {
        monitor_id: req.params.id,
        engine: req.params.engine
      }
    });

    res
      .send({
        monitor,
        config,
        alerts
      })
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

router.post("/frames", async (req, res) => {
  try {
    io.in("kafka").emit("new-frame", req.body);
    res.status(200).end();
  } catch (err) {
    console.log(err);
    res
      .send(err)
      .status(400)
      .end();
  }
});

module.exports = router;
