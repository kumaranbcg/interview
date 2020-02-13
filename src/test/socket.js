var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', () => {
  socket.emit('create-device', { id: 1, config: 1 });
  socket.disconnect()
  console.log(socket.id)
  // socket.emit('get-device', { id: 1 });
  // socket.emit('change-zoom', {
  //   id: 2,
  //   config: {
  //     "c1p1x1": "0.10",
  //     "c1p1x2": "1",
  //     "c1p1x3": "1",
  //     "c1p1x4": "0",
  //     "c1p1y1": "1",
  //     "c1p1y2": "1",
  //     "c1p1y3": "0.45",
  //     "c1p1y4": "",
  //     "c1p2x1": "0.09",
  //     "c1p2x2": "1",
  //     "c1p2x3": "1",
  //     "c1p2x4": "0",
  //     "c1p2y1": "1",
  //     "c1p2y2": "1",
  //     "c1p2y3": "0.45",
  //     "c1p2y4": "",
  //     "c2p1x1": "0.09",
  //     "c2p1x2": "1",
  //     "c2p1x3": "1",
  //     "c2p1x4": "0",
  //     "c2p1y1": "1",
  //     "c2p1y2": "1",
  //     "c2p1y3": "0.45",
  //     "c2p1y4": "",
  //     "c2p2x1": "0.09",
  //     "c2p2x2": "1",
  //     "c2p2x3": "1",
  //     "c2p2x4": "0",
  //     "c2p2y1": "1",
  //     "c2p2y2": "1",
  //     "c2p2y3": "0.45",
  //     "c2p2y4": ""
  //   }
  // });
  // socket.emit('update-device', {
  //   id: 2,
  //   order: 1,
  //   config: 1
  // });

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