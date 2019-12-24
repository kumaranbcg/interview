const server = require("http").createServer(app);
server.listen(port, () => console.log(`Customindz listening on port ${port}!`));

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === "local") {
  // global.cv = require("/usr/lib/node_modules/opencv4nodejs");
  require("./media-server");
}