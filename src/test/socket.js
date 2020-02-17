const URL = 'http://localhost:5000';
var socket = require('socket.io-client')(URL);
const axios = require('axios').default;
socket.on('connect', async () => {
  // Initialize Monitor ID 
  const monitor_id = 'jetson_camera_test'
  // Take Socket ID and store for passing in detection
  const socket_id = socket.id;

  setTimeout(() => {
    socket.disconnect();
    // If any detection found send the video url or image url with socket id information and engine type along with camera id
    await axios.post(`${URL}/api/admin/detection/incoming`, {
      "engine": "danger-zone",
      "monitor_id": monitor_id,
      "socket_id": socket_id,
      "video_url": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "image_url": "https://media.gettyimages.com/photos/high-angle-view-of-people-on-street-picture-id973190966?s=2048x2048"
    });
  }, 120000)

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