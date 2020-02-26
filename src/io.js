const socketio = require("socket.io");

const { ZoomConfig, SocketLog, Monitor } = require("./lib/db");
const { sequelize } = require("./lib/db");

let io;
module.exports = server => {
  if (!io && server) {
    io = socketio(server);

    io.on("connection", async socket => {
      let monitor_id;
      console.log(socket.id)
      socket.on('disconnect', async () => {
        console.log("LOG: just disconnected: " + socket.id)
        const time_out = new Date().toString();
        await SocketLog.update({
          time_out
        }, {
          where: {
            socket_id: socket.id,
          }
        });
        if (monitor_id) {
          await Monitor.update({
            time_out
          }, {
            where: { id: monitor_id }
          });
        }
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
        if (data.config && id) {
          if (config && id) {
            await Monitor.update({
              config: data.config
            }, {
              where: { id }
            });


            const output = await sequelize.query("SELECT a.id, a.name, a.connection_uri, a.config as config_id, b.config FROM `monitors` a LEFT JOIN `zoom_config` b ON a.config = b.id WHERE a.id=:id ",
              {
                replacements: { id },
                type: QueryTypes.SELECT
              });

            socket.emit('device-data', output[0]);
            socket.broadcast.emit('device-data', output[0]);
          }
        }
      });

      socket.on("send-meta", async data => {
        if (data.monitor_id) {
          monitor_id = data.monitor_id || data.id;;
          console.log('connected', socket.id, data.monitor_id)
          await SocketLog.create({
            socket_id: socket.id,
            time_in: socket.handshake.time,
            monitor_id
          });
          await Monitor.update({
            time_in: socket.handshake.time,
            time_out: null
          }, {
            where: { id: monitor_id }
          });

        }
      })

      socket.on("get-device", async id => {
        console.log('get-device')

        const output = await sequelize.query("SELECT a.id, a.name, a.connection_uri, a.config as config_id, b.config FROM `monitors` a LEFT JOIN `zoom_config` b ON a.config = b.id WHERE a.id=:id ",
          {
            replacements: { id },
            type: QueryTypes.SELECT
          });
        socket.emit('device-data', output[0]);
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
