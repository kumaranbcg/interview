const express = require("express");
const router = express.Router();
const Configuration = require("../models/configuration");

router.get("/", async (req, res) => {
  // Get All For User
  try {
    const data = await Configuration.findOne({
      where: {
        monitor_id: req.query.monitor_id,
        engine: req.query.engine
      }
    });
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

module.exports = router;
