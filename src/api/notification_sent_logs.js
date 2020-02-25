const express = require("express");
const router = express.Router();
const { AlertLog, Alert, Monitor } = require("../lib/db");

router.get("/", async (req, res) => {
  try {
    let query = {
      offset: 0,
      include: [
        {
          model: Alert,
          required: true,
          include: [
            {
              model: Monitor,
              required: true,
              where: {
                user_id: req.user["cognito:username"]
              }
            }
          ]
        }
      ]
    };

    if (req.query.limit) {
      query.limit = req.query.limit;
      if (req.query.page) {
        query.offset = (Math.min(req.query.page) - 1) * req.query.limit;
      }
    }

    if (req.query.orderBy) {
      query.order = [[req.query.orderBy]];
    }

    const data = await AlertLog.findAndCountAll(query);

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
  console.log("Creating Notification Log");
  try {
    // if (process.env.NODE_ENV === "local") {
    // } else {
    //   console.log("Checking server address");
    //   await axios.get(
    //     "https://media.customindz.com/server/probe?path=" +
    //       req.body.connection_uri
    //   );
    // }

    const MONITOR_ID = req.body.id || shortid.generate();
    const newMonitor = {
      id: MONITOR_ID,
      user_id: req.user["cogni∂to:username"],
      name: req.body.name || "Default Monitor Name",
      connection_uri: req.body.connection_uri,
      play_from_source: false,
      graph: [],
      engines: [],
      type: req.body.type || "normal"
    };

    await Monitor.create(newMonitor);

    res.status(200).json({
      id: newMonitor.id,
      message: "Successfully Added Monitor"
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
