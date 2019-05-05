const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");

// define the home page route
router.get("/", function(req, res) {
  res.send("API page");
});
// define the about route
router.get("/authenticated", authentication.verify, function(req, res) {
  res.send("Authenticated!");
});

module.exports = router;
