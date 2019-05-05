const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const api = require("./api/index.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api", api);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
