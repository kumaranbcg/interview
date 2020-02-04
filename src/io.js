const socketio = require("socket.io");

const { Devices, ZoomConfig } = require("./lib/db");


let io;
module.exports = server => {
  if (!io && server) {
    io = socketio(server);

    io.on("connection", socket => {
      console.log(socket.id, socket.handshake.address);
      socket.on('update-zoom-data', async data => {
        const id = `${data.id}`
        await Devices.update(data, {
          where: { id }
        });

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
        const output = await Devices.findOne(query)

        socket.broadcast.emit('zoom-data', output);
      });

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
        const output = await Devices.findOne(query)

        socket.emit('zoom-data', output);
      });
    });
  }

  return io;
};
