const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const monitorRouter = require("./monitor");
const detectionRouter = require("./detection");
const vodRouter = require("./vod");

// define the home page route
router.get("/", function(req, res) {
  res.send("API page");
});
// define the about route
router.get("/authenticated", authentication.verify, function(req, res) {
  res.send("Authenticated!");
});

require("./shinobi")(router);
require("./alert")(router);

router.use("/monitor", authentication.verify, monitorRouter);
router.use("/detection", authentication.verifyMachine, detectionRouter);
router.use("/vod", authentication.verifyMachine, vodRouter);

module.exports = router;
