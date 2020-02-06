const socketio = require("socket.io");

const { Devices, ZoomConfig } = require("./lib/db");


const configFile = './config.json';
let io;
module.exports = server => {
  if (!io && server) {
    io = socketio(server);

    io.on("connection", socket => {
      console.log(socket.id, socket.handshake.address);

      socket.on("get-zoom", async data => {
        const output = await ZoomConfig.findOne({
          where: {
            id: data.id
          }
        })
        socket.emit('zoom-data', output);

      });

      socket.on("change-zoom", async data => {

        let output = await ZoomConfig.findOne({
          where: {
            id: data.id
          }
        })
        if (output) {
          await ZoomConfig.update({
            config: data.config
          }, {
            where: { id: data.id }
          })
          output = await ZoomConfig.findOne({
            where: {
              id: data.id
            }
          })
          socket.emit('zoom-data', output);
        } else {
          output = await ZoomConfig.create(data)
          socket.emit('zoom-data', output);
        }

      });

      socket.on("create-device", async data => {
        const config = require(configFile)
        if (data.id) {
          const newData = {
            config: JSON.stringify(data.config || config),
            id: data.id
          };

          await Devices.create(newData);
          const query = {
            where: {
              id: data.id
            },
          }

          const output = await Devices.findAll(query)

          socket.emit('device-data', output);

        }
      });

      socket.on('update-device', async data => {
        const id = `${data.id}`
        const order = `${data.order}`
        await Devices.update(data, {
          where: { id, order }
        });

        const query = {
          where: {
            id
          },
        }
        const output = await Devices.findAll(query)

        socket.emit('device-data', output);
        socket.broadcast.emit('device-data', output);
      });

      socket.on("get-device", async data => {
        const query = {
          where: {
            id: data.id
          },
        }
        const output = await Devices.findAll(query)

        socket.emit('device-data', output);
      });
    });
  }

  return io;
};
