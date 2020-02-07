const socketio = require("socket.io");
const shortid = require("shortid");

const { Devices, ZoomConfig, SocketLog } = require("./lib/db");

let io;
module.exports = server => {
  if (!io && server) {
    io = socketio(server);

    io.on("connection", async socket => {
      console.log('connected', socket.id)
      await SocketLog.create({
        socket_id: socket.id,
        ip: socket.handshake.address,
        time_in: socket.handshake.time
      });
      console.log(socket.id)
      socket.on('disconnect', async () => {
        console.log("LOG: just disconnected: " + socket.id)
        await SocketLog.update({
          time_out: new Date().toString()
        }, {
          where: {
            socket_id: socket.id,
            ip: socket.handshake.address,
          }
        });
      })

      socket.on("get-zoom", async data => {
        const output = await ZoomConfig.findOne({
          where: {
            id: data.id
          }
        })
        socket.emit('zoom-data', output);

      });

      socket.on("get-logs", async data => {
        const output = await SocketLog.findAll()
        socket.emit('log-data', output);
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
          else {
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
              where: { id }
            });

            const query = {
              where: {
                id
              },
            }
            const output = await Devices.findOne(query)

            socket.emit('device-data', output);
            socket.broadcast.emit('device-data', output);
          }
        }
      });

      socket.on("send-meta", async data => {
        await SocketLog.update(data, {
          where: {
            socket_id: socket.id,
          }
        });
      })

      socket.on("get-device", async data => {
        console.log('get-device')
        const query = {
          where: {
            id: data.id
          },
        };
        const output = await Devices.findAll(query)

        socket.emit('device-data', output);
      });

      socket.on("get-config-list", async data => {
        const output = await ZoomConfig.findAll({})

        socket.emit('config-list', output);
      });


      socket.on("get-device-list", async data => {
        console.log('get-device-list')
        const output = await Devices.findAll({})

        socket.emit('device-list', output);
      });

    });
  }

  return io;
};
