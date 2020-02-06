const socketio = require("socket.io");
const shortid = require("shortid");

const { Devices, ZoomConfig } = require("./lib/db");

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
        let output;
        if (data.id) {
          output = await ZoomConfig.findOne({
            where: {
              id: data.id
            }
          })
        }
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
        if (data.config) {
          const zoomConfig = await ZoomConfig.findOne({
            where: {
              id: data.config
            }
          })
          if (!zoomConfig) {
            socket.emit('input-error', 'config is not available')
          }
          if (zoomConfig) {
            const newData = {
              id: shortid(),
              config: JSON.stringify(zoomConfig.config)
            };

            const output = await Devices.create(newData);

            socket.emit('device-data', output);

          }
        }
      });

      socket.on('update-device', async data => {
        const id = `${data.id}`
        const order = `${data.order}`
        if (data.config) {
          const config = await ZoomConfig.findOne({
            where: {
              id: data.config
            }
          })
          if (!config) {
            socket.emit('input-error', 'config is not available')
          }
          if (config && id) {
            await Devices.update({
              config
            }, {
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
          }
        }
      });

      socket.on("get-device", async data => {
        const query = {
          where: {
            id: data.id
          },
        };
        const output = await Devices.findAll(query)

        socket.emit('device-data', output);
      });

      socket.on("get-devices", async () => {
        const output = await Devices.findAll({})

        socket.emit('devices-list', output);
      });

    });
  }

  return io;
};
