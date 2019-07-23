const express = require("express");
const router = express.Router();
const Monitor = require("../models/monitor");
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
