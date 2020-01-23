const express = require("express");
const fileUpload = require('express-fileupload');
const cors = require("cors");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const api = require("./api/index.js");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(fileUpload());

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api", api);
app.use("/frames", express.static(path.join(process.cwd(), "frames")));

module.exports = app;
