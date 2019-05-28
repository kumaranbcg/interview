const express = require("express");
const router = express.Router();
const Monitor = require("../models/monitor");

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

module.exports = router;
