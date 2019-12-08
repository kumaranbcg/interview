const { Puller, PullerServer } = require("../lib/db");
const authentication = require("../middleware/authentication");
const axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("/", authentication.checkAdmin, async (req, res, next) => {
  try {
    const servers = await PullerServer.findAll({
      include: [
        {
          model: Puller,
          as: "puller"
        }
      ]
    });
    res.send(servers);
  } catch (err) {
    res
      .status(400)
      .send(err.message)
      .end();
  }
});

router.get("/:id", authentication.checkAdmin, async (req, res, next) => {
  try {
    const server = await PullerServer.findOne({
      id: req.params.id
    });
    const { data: serverStatus } = await axios.get(
      `http://${server.address}:3000/list`
    );
    res.send(serverStatus);
  } catch (err) {
    res
      .status(400)
      .send(err.message)
      .end();
  }
});

module.exports = router;
