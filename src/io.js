const socketio = require("socket.io");

const { ZoomConfig, SocketLog, Monitor } = require("./lib/db");

let io;
module.exports = server => {
  if (!io && server) {
    io = socketio(server);

    io.on("connection", async socket => {
      console.log(socket.id)
      socket.on('disconnect', async () => {
        console.log("LOG: just disconnected: " + socket.id)
        await SocketLog.update({
          time_out: new Date().toString()
        }, {
          where: {
            socket_id: socket.id,
          }
        });
      })

      socket.on("get-zoom", async data => {
        const output = await ZoomConfig.findOne({
          where: {
            id: data.config_id || data.id
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
        const id = data.config_id || data.id;
        if (id) {
          output = await ZoomConfig.findOne({
            where: {
              id
            }
          })
        }
        if (output) {
          await ZoomConfig.update({
            config: data.config
          }, {
            where: { id }
          })
          output = await ZoomConfig.findOne({
            where: {
              id
            }
          })
          socket.emit('zoom-data', output);
        } else {
          output = await ZoomConfig.create(data)
          socket.emit('zoom-data', output);
        }

      });

      socket.on('update-device', async data => {
        const id = `${data.monitor_id || data.id}`
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
            await Monitor.update({
              config
            }, {
              where: { id }
            });

            const output = await Monitor.findOne({
              where: {
                id
              },
            })

            socket.emit('device-data', output);
            socket.broadcast.emit('device-data', output);
          }
        }
      });

      socket.on("send-meta", async data => {
        if (data.monitor_id) {
          console.log('connected', socket.id, data.monitor_id)
          await SocketLog.create({
            socket_id: socket.id,
            time_in: socket.handshake.time,
            monitor_id: data.monitor_id
          });
        }
      })

      socket.on("get-device", async data => {
        console.log('get-device')
        const query = {
          where: {
            id: data.monitor_id || data.id
          },
        };
        const output = await Monitor.findOne(query)

        socket.emit('device-data', output);
      });

      socket.on("get-config-list", async data => {
        const output = await ZoomConfig.findAll({})

        socket.emit('config-list', output);
      });


      socket.on("get-device-list", async data => {
        console.log('get-device-list')
        const output = await Monitor.findAll({})

        socket.emit('device-list', output);
      });

    });
  }

  return io;
};
