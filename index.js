const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const io = require("./io")(server);
const bodyParser = require("body-parser");

const api = require("./api/index.js");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api", api);

const port = 3000;
server.listen(port, () => console.log(`Customindz listening on port ${port}!`));
