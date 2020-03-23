const socketio = require("socket.io");

const { ZoomConfig, SocketLog, Monitor } = require("./lib/db");
const { sequelize } = require("./lib/db");
const { QueryTypes } = require("sequelize");
const moment = require('moment')

let io;
module.exports = server => {
  if (!io && server) {
    io = socketio(server);

    io.on("connection", async socket => {
      let monitor_id;


      socket.on('internal-socket', () => {
        console.log('connected with internal socket');

        let now = new Date().getDay();

        setInterval(() => {
          const current = new Date().getDay();
          if (current != now) {
            console.log(`Day changed from ${now} to ${current}`)
            now = current;
            // Emit when day changes
            socket.broadcast.emit('new-detection', { engine: 'date-change', monitor_name: 'Date change refresh'})
          }
        }, 1000);
      })


      socket.on('new-detection', data => {
        // Emit when a new detection arrives from internal socket
        socket.broadcast.emit('new-detection', data);
      })

      socket.on('disconnect', async () => {
        console.log("LOG: just disconnected: " + socket.id)
        const time_out = moment().toDate();
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
          socket.broadcast.emit('status-change');
        }
      })

      socket.on("send-meta", async data => {

        if (data.monitor_id && !monitor_id) {

          monitor_id = data.monitor_id || data.id;;
          console.log('connected', socket.id, data.monitor_id)
          socket.broadcast.emit('status-change');

          const socketLog = await Monitor.findOne({
            where: {
              socket_id: socket.id
            }
          })
          if (!socketLog) {
            await SocketLog.update({
              time_out: moment().toDate()
            }, {
              where: { monitor_id, time_out: null }
            });

            await SocketLog.create({
              socket_id: socket.id,
              time_in: moment().toDate(),
              monitor_id
            });
            await Monitor.update({
              socket_id: socket.id,
              time_in: moment().toDate(),
              time_out: null
            }, {
              where: { id: monitor_id }
            });
          }
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
      });

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
