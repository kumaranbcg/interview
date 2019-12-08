const { Puller, PullerServer, Monitor } = require("../lib/db");
const authentication = require("../middleware/authentication");
const axios = require("axios");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const server = await PullerServer.findOne({
      where: {
        id: req.body.server_id
      }
    });
    await axios.post(`http://${server.address}:3000/pm2`, {
      script: "docker.js",
      name: req.body.monitor_id,
      max_memory_restart: "200M",
      args: [
        `--VIACT_PULLER_TYPE=PULL_SNAPSHOT_RECORD --VIACT_PULLER_MONITOR=${req.body.monitor_id}`
      ]
    });
    await Puller.create(req.body);
    res.send({
      message: "Successfully deleted puller"
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err.message)
      .end();
  }
});

router.get("/", authentication.checkAdmin, async (req, res, next) => {
  try {
    const pullers = await Puller.findAll({
      include: [
        {
          model: PullerServer,
          as: "server"
        },
        {
          model: Monitor,
          as: "monitor"
        }
      ]
    });
    res.send(pullers);
  } catch (err) {
    res
      .status(400)
      .send(err.message)
      .end();
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = await Puller.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: PullerServer,
          as: "server"
        }
      ]
    });
    const { data: serverStatus } = await axios.get(
      `http://${data.server.address}:3000/pm2/${data.monitor_id}`
    );
    res.send({
      ...data.toJSON(),
      serverStatus
    });
  } catch (err) {
    res
      .status(400)
      .send(err.message)
      .end();
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const data = await Puller.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: PullerServer,
          as: "server"
        }
      ]
    });
    await Puller.destroy({
      where: {
        id: req.params.id
      }
    });
    await axios.delete(
      `http://${data.server.address}:3000/pm2/${data.monitor_id}`
    );
    res.send({
      message: "Successfully deleted puller"
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send(err.message)
      .end();
  }
});

module.exports = router;
