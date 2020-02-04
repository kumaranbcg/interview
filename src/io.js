const socketio = require("socket.io");

const { Devices, ZoomConfig } = require("./lib/db");


let io;
module.exports = server => {
  if (!io && server) {
    io = socketio(server);

    io.on("connection", socket => {
      console.log(socket.id, socket.handshake.address)
      socket.on("get-zoom-data", async id => {
        const query = {
          where: {
            id
          },
          include: [
            {
              model: ZoomConfig,
              as: "detectionZone1",
            },
            {
              model: ZoomConfig,
              as: "detectionZone2",
            }
          ]
        }
        const data = await Devices.findOne(query)

        socket.emit('zoom-data', data)
      });
    });
  }

  return io;
};
