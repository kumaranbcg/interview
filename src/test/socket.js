const URL = 'http://3.20.122.193';
var socket = require('socket.io-client')(URL);
const axios = require('axios').default;
socket.on('connect', async () => {
  console.log('connected')
  // Initialize Monitor ID 
  const monitor_id = 'AkC3l7VPe'
  // Take Socket ID and store for passing in detection
  const socket_id = socket.id;

  // socket.emit('get-device', {
  //   monitor_id
  // })

  // socket.emit('update-device', {
  //   monitor_id,
  //   config: 1
  // })

  // socket.emit('get-device', {
  //   id: monitor_id
  // })

  // socket.emit('get-zoom', {
  //   id: 1
  // })

  // socket.emit('get-zoom', {
  //   config_id: 1
  // })


  setTimeout(async () => {
    socket.emit('send-meta', {
      monitor_id
    })
    console.log('sent-meta')

  }, 1000)


  setTimeout(async () => {
    console.log('disconnect')
    socket.disconnect();
    // If any detection found send the video url or image url with socket id information and engine type along with camera id
    await axios.post(`${URL}/api/admin/detection/incoming`, {
      "engine": "danger-zone",
      "monitor_id": monitor_id,
      "socket_id": socket_id,
      "video_url": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "image_url": "https://media.gettyimages.com/photos/high-angle-view-of-people-on-street-picture-id973190966?s=2048x2048"
    }).catch(console.error)
  }, process.env.TIMEOUT || 30000)

});

socket.on('ping', () => {
  console.log('ping');
  socket.emit('pong', '');
})

socket.on('input-error', (data) => {
  console.error('error')
});


socket.on('device-data', (data) => {
  console.log('received device-data')
});


socket.on('zoom-data', (data) => {
  console.log('received zoom-data')
});


socket.on('disconnect', function () {
  console.log('disconnect')
});