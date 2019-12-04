const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const monitorRouter = require("./monitor");
const monitorAdminRouter = require("./monitor-admin");
const detectionRouter = require("./detection");
const detectionAdminRouter = require("./detection-admin");
const vodRouter = require("./vod");
const vodAdminRouter = require("./vod-admin");
const alertRouter = require("./alert");
const alertLogRouter = require("./alert-log");
const configurationRouter = require("./configuration");
const configurationAdminRouter = require("./configuration-admin");
const reportRouter = require("./report");
const ysRouter = require("./ys");
const pullerRouter = require("./puller");
const authRouter = require("./auth");

// define the home page route
router.get("/", function(req, res) {
  console.log(req.query);
  res.send("API page" + req.query.name);
});
// define the about route
router.get("/authenticated", authentication.verify, function(req, res) {
  res.send("Authenticated!");
});

router.use("/auth", authRouter);
router.use("/monitor", authentication.verify, monitorRouter);
router.use("/detection", authentication.verify, detectionRouter);
router.use("/vod", authentication.verify, vodRouter);
router.use("/alert", authentication.verify, alertRouter);
router.use("/alert-log", authentication.verify, alertLogRouter);
router.use("/configuration", authentication.verify, configurationRouter);
router.use("/report", reportRouter);
router.use("/ys", ysRouter);
router.use("/puller", authentication.verify, pullerRouter);

router.use("/admin/monitor", authentication.verifyMachine, monitorAdminRouter);
router.use(
  "/admin/detection",
  authentication.verifyMachine,
  detectionAdminRouter
);
router.use("/admin/vod", authentication.verifyMachine, vodAdminRouter);

router.use(
  "/admin/configuration",
  authentication.verifyMachine,
  configurationAdminRouter
);

router.post("/local", authentication.verifyMachine, (req, res) => {
  res.status(200).end();
});

module.exports = router;
