const socketio = require("socket.io");
let io;
module.exports = server => {
  if (!io && server) {
    io = socketio(server);

    io.on("connection", socket => {
      socket.on("listen-monitor", room => {
        console.log("Some one joined monitor " + room);
        socket.join(room);
      });
    });
  }

  return io;
};
