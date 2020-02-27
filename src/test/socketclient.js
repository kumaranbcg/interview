const URL = 'http://3.20.122.193';
var socket = require('socket.io-client')(URL);
const axios = require('axios').default;
socket.on('connect', async () => {
  console.log('connected')
  // Initialize Monitor ID 
  const monitor_id = "testMonitor123"
  // Take Socket ID and store for passing in detection

  socket.emit('get-device', monitor_id)

  socket.emit('update-device', {
    monitor_id,
    config: 3
  })
  setTimeout(async () => {
    socket.emit('send-meta', {
      monitor_id
    })
    console.log('sent-meta')
  }, 1000)
});

socket.on('input-error', (data) => {
  console.error('error', data)
});


socket.on('device-data', (data) => {
  console.log('received device-data', data)
});


socket.on('zoom-data', (data) => {
  console.log('received zoom-data', data)
});


socket.on('disconnect', function () {
  console.log('disconnect')
});