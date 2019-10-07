const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const path = require("path");
const io = require("./io")(server);
const bodyParser = require("body-parser");

const api = require("./api/index.js");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api", api);
app.use("/frames", express.static(path.join(process.cwd(), "frames")));

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Customindz listening on port ${port}!`));

if (process.env.NODE_ENV === "local") {
  // global.cv = require("/usr/lib/node_modules/opencv4nodejs");
  require("./media-server");
}
