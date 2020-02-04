var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', (io) => {
  console.log('connect')
  socket.emit('get-zoom-data', 1);
  socket.on('zoom-data', (data) => {
    console.log(data)
  });
});


socket.on('disconnect', function () {
  console.log('disconnect')
});