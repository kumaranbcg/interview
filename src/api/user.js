const express = require("express");
const router = express.Router();
const { User } = require("../lib/db");

router.get("/", async (req, res, next) => {
  try {
    var data = await User.findAll({});
    res.status(200).json(data);
  } catch (err) {
    res
      .send(err)
      .status(400)
      .end();
  }
});

module.exports = router;
