const app = require('./app')
const port = process.env.PORT || 3000;
//const port = process.env.PORT || 5000;

const server = require("http").createServer(app);
const io = require("./io")(server);
global.io = io; //added
server.listen(port, () => console.log(`Customindz listening on port ${port}! ${new Date()}`));


if (process.env.NODE_ENV === "local") {
  // global.cv = require("/usr/lib/node_modules/opencv4nodejs");
  require("./media-server");
}