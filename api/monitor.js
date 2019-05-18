const express = require("express");
const shortid = require("shortid");
const router = express.Router();
const { BASE, API_KEY, GROUP_KEY } = require("../shinobiConfig.json");
const BASE_API = BASE + API_KEY + "/";
router.get("/all", (req, res, next) => {
  // Get All For User
  res
    .send("WIP")
    .status(200)
    .end();
});

router.get("/:id", (req, res, next) => {
  res
    .send("WIP")
    .status(200)
    .end();
});

router.post("/", async (req, res, next) => {
  try {
    // Several Things To Do When setup
    const MONITOR_ID = shortid.generate();
    const config = JSON.stringify(req.body.config);
    await axios.get(
      `${BASE_API}/configureMonitor/${GROUP_KEY}/${MONITOR_ID}/add?data=` +
        config
    );

    // Create Monitor In Our Database
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

router.put("/:id", async (req, res, next) => {
  try {
    const MONITOR_ID = req.body.monitor_id;
    const config = JSON.stringify(req.body.config);
    await axios.get(
      `${BASE_API}/configureMonitor/${GROUP_KEY}/${MONITOR_ID}/edit?data=` +
        config
    );
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

router.delete("/:id", async (req, res, next) => {
  try {
    const MONITOR_ID = req.body.monitor_id;
    await axios.get(
      `${BASE_API}/configureMonitor/${GROUP_KEY}/${MONITOR_ID}/delete`
    );
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
