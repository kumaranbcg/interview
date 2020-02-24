const URL = 'http://3.20.122.193';
var socket = require('socket.io-client')(URL);
const axios = require('axios').default;
socket.on('connect', async () => {
  console.log('connected')
  // Initialize Monitor ID 
  const monitor_id = 'jetson_camera_test123'
  // Take Socket ID and store for passing in detection
  const socket_id = socket.id;

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
    });
  }, process.env.TIMEOUT || 60000)

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