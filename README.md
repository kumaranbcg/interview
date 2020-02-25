# Customindz Backend Documentation

The user authentication is made using cognito and permissions are being managed in mysql

# Postman Collection

`https://documenter.getpostman.com/view/1901360/SWTK4u6g`

# Camera for Socket/General API

1. Register Camera in POST call to `/api/monitor` endpoint
2. Update machinary or device details with same endpoint

# Detection
 On detection call `/api/admin/detection/incoming/` endpoint with required data with image url, video url and socket id (will be received on connection to backend socket from Jetson device) and camera id and detection type. So the detection will be recorded in backend.

# Socket
## Zoom Level and Devices using socket
The jetson nano device will be connected to the server via socket.io

First config needs to created  (change-zoom)
configure camera id in code and start observing for event by sending request to (get-device) and receiving it in (device-data)

### Basic code
`Javascript`
```js
var socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', (io) => {
  socket.emit('get-device', { id: 1 });
});

socket.on('device-data', (data) => {
  console.log('received device data', data)
});

socket.on('disconnect', function () {
  console.log('disconnect')
});
```
`Python`
```python
import socketio

sio = socketio.Client()


def getdata():

    @sio.event
    def connect():
        print('connection established')
        sio.emit('get-device', '1')
    
    @sio.on('device-data')
    def device_data(data):
        print(data)
        
    @sio.event
    def disconnect():
        print('disconnected from server')
  
    sio.connect('http://localhost:3000/')
    sio.wait();
```


# Socket 
## Flow
### New Device and Zoom Config
First create camera then we will use the camera id in our python/nodejs code running in Jetson. Write a socket code to connect to backend API server. Once connected send an emit event `get-device` event to server and you will receive a device data response in `device-data`. This device data will contain current zoom level required for Jetson. Once connnected successfully call `send-meta` with your camera id information. This will be used to identify your device for the particular socket session.

### Disconnecting
When connected to a server Jetson machinary time will get start tracking. So it is important to properly use .disconnect function to disconnect from server.

### Zoom Config change for a device
Use `update-device` to update device information such as zoom config. After updating every connected Jetson will receive a notification about change. So it is important to check if the config you receive is for your current camera id only. 

### Create Read Zoom Config
Call `get-config-list` to see all available zoom config. you can get the data in `config-list`
Call `get-device-list` to see all available devices. you can get the data in `device-list`



## Steps

1. Create Device
`POST` `/api/monitor`
```json
{
	"monitor_id": "jetson_camera_test",
	"device_id": "Test Device 1",
	"machine_id": "Test Machine 1",
	"connection_uri": "sample_connection"
}
```
2. Join Socket and Disconnect after machine/device goes offline
```js
socket.on('connect', () => {
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
});
```
3. Incase of detection send a API call to `POST` `/api/admin/detection/incoming`
```json
    {
      "engine": "danger-zone",
      "monitor_id": monitor_id,
      "socket_id": socket_id,
      "video_url": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "image_url": "https://media.gettyimages.com/photos/high-angle-view-of-people-on-street-picture-id973190966?s=2048x2048"
    }
```

```js
    // If any detection found send the video url or image url with socket id information and engine type along with camera id
    await axios.post(`${URL}/api/admin/detection/incoming`, {
      "engine": "danger-zone",
      "monitor_id": monitor_id,
      "socket_id": socket_id,
      "video_url": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "image_url": "https://media.gettyimages.com/photos/high-angle-view-of-people-on-street-picture-id973190966?s=2048x2048"
    });
```

4. To See device list and socket logs in UI use `GET` `api/dashboard/dangerzone?period_from=2018-05-05` endpoint to get below respone


```json
{
socketLogs: [
{
id: 13,
socket_id: "EAhHiPwMu9c21WCKAAAB",
time_in: "2020-02-13T05:32:06.000Z",
time_out: "2020-02-13T05:32:11.000Z",
created_at: "2020-02-13T05:32:06.000Z",
updated_at: "2020-02-13T05:32:11.000Z",
monitor_id: "jetson_camera_2",
name: "Default Monitor Name",
active_time_minutes: 0
},
{
id: 3,
socket_id: "JsFwxxTG7b5GbaMsAAAB",
time_in: "2020-02-13T04:55:10.000Z",
time_out: null,
created_at: "2020-02-13T04:55:10.000Z",
updated_at: "2020-02-13T04:55:20.000Z",
monitor_id: "1",
name: null,
active_time_minutes: null
}
],
devices: [
{
monitor_id: "HHDT1",
name: "HHDT1",
active: "Y",
id: null,
timestamp: "2020-02-10T10:29:57.000Z",
alert: 1,
result: ""Y"",
created_at: null,
updated_at: null,
engine: "dump-truck",
image_url: "https://sgp1.digitaloceanspaces.com/viact/alerts/HHDT1/00257cdf-bbb1-4998-8223-e0809c12d659.jpg",
unread: 0,
truck_capacity: 1,
video_url: null,
socket_id: null,
time_in: null,
time_out: null,
monitor_id: null
},
{
monitor_id: "HHDT2",
name: "HHDT2",
active: "Y",
id: null,
timestamp: "2020-02-10T09:32:25.000Z",
alert: 1,
result: ""Y"",
created_at: null,
updated_at: null,
engine: "dump-truck",
image_url: "https://sgp1.digitaloceanspaces.com/viact/alerts/HHDT2/070f0ee5-6a17-4674-bbb4-ce0044f7b808.jpg",
unread: 1,
truck_capacity: 1,
video_url: null,
socket_id: null,
time_in: null,
time_out: null,
monitor_id: null
},
{
monitor_id: "jetson_camera_2",
name: "Default Monitor Name",
active: "Y",
id: null,
timestamp: "2020-02-13T09:41:53.000Z",
alert: 1,
result: ""Y"",
created_at: null,
updated_at: null,
engine: "danger_zone",
image_url: "https://sgp1.digitaloceanspaces.com/viact/alerts/jetson_camera_2/6ceaae63-afc8-4f36-a1c1-f237a6dfbf2e.jpg",
unread: 0,
truck_capacity: 5,
video_url: null,
socket_id: null,
time_in: null,
time_out: null,
monitor_id: null
},
{
monitor_id: "jetson_camera_test",
name: "Default Monitor Name",
active: "Y",
id: 62,
timestamp: "2020-02-17T13:03:10.000Z",
alert: 1,
result: null,
created_at: "2020-02-17T07:32:58.000Z",
updated_at: "2020-02-17T07:33:10.000Z",
engine: "danger-zone",
image_url: "https://media.gettyimages.com/photos/high-angle-view-of-people-on-street-picture-id973190966?s=2048x2048",
unread: 1,
truck_capacity: 5,
video_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
socket_id: "E-ODpT5obGvo4lS7AAAA",
time_in: "2020-02-17T07:32:58.000Z",
time_out: "2020-02-17T07:33:10.000Z",
monitor_id: null
}
]
}
```


### To stop machine Tracking to update machine up time
`Javascript`
```js
  socket.disconnect()

```

`Python`
```py
sio.disconnect()
```

### Jetson will be identified by camera id it has stored in code and passing to socket by below method

`Javascript`
```js
  socket.emit('send-meta', {
    monitor_id: 'cam ht 1'
  })

```

`Python`
```py
sio.emit('send-meta', {
    monitor_id: 'cam ht 1'
  })
```


### to get logs from socket connection log table

`Javascript`
```js
  socket.emit('get-logs', '')
  socket.on('log-data', data=>{
    console.log(data)
  })

```

`Javascript`
```js
socket.emit('get-device',{ id:'bcC5qflpK' });
```
`Python`
```py
sio.emit('get-device', { id:'bcC5qflpK'}')
```

### once the request is passed response is sent in `device-data` event

`Javascript`
```js
socket.on('device-data', (data) => {
  console.log('received device data', data)
});
```
`Python`
```py
@sio.on('device-data')
def device_data(data):
    print(data)
```

### To update any zoom data or device data


`Javascript`
this will take the zoom config and update the device config
```js
socket.emit('update-device',{ 
  id:1, 
  config: 2
});
```
this will create/update zoom on given id
```js
socket.emit('change-zoom',{ 
  id:2,
  config: {
      "c1p1x1": "0.10",
      "c1p1x2": "1",
      "c1p1x3": "1",
      "c1p1x4": "0",
      "c1p1y1": "1",
      "c1p1y2": "1",
      "c1p1y3": "0.45",
      "c1p1y4": "",
      "c1p2x1": "0.09",
      "c1p2x2": "1",
      "c1p2x3": "1",
      "c1p2x4": "0",
      "c1p2y1": "1",
      "c1p2y2": "1",
      "c1p2y3": "0.45",
      "c1p2y4": "",
      "c2p1x1": "0.09",
      "c2p1x2": "1",
      "c2p1x3": "1",
      "c2p1x4": "0",
      "c2p1y1": "1",
      "c2p1y2": "1",
      "c2p1y3": "0.45",
      "c2p1y4": "",
      "c2p2x1": "0.09",
      "c2p2x2": "1",
      "c2p2x3": "1",
      "c2p2x4": "0",
      "c2p2y1": "1",
      "c2p2y2": "1",
      "c2p2y3": "0.45",
      "c2p2y4": ""
    } 
  });
```
`Python`
```py
sio.emit('update-device', { id:1, config:2 })
```

```py
sio.emit('change-zoom', 
{ 
  id:2,
  config: {
      "c1p1x1": "0.10",
      "c1p1x2": "1",
      "c1p1x3": "1",
      "c1p1x4": "0",
      "c1p1y1": "1",
      "c1p1y2": "1",
      "c1p1y3": "0.45",
      "c1p1y4": "",
      "c1p2x1": "0.09",
      "c1p2x2": "1",
      "c1p2x3": "1",
      "c1p2x4": "0",
      "c1p2y1": "1",
      "c1p2y2": "1",
      "c1p2y3": "0.45",
      "c1p2y4": "",
      "c2p1x1": "0.09",
      "c2p1x2": "1",
      "c2p1x3": "1",
      "c2p1x4": "0",
      "c2p1y1": "1",
      "c2p1y2": "1",
      "c2p1y3": "0.45",
      "c2p1y4": "",
      "c2p2x1": "0.09",
      "c2p2x2": "1",
      "c2p2x3": "1",
      "c2p2x4": "0",
      "c2p2y1": "1",
      "c2p2y2": "1",
      "c2p2y3": "0.45",
      "c2p2y4": ""
    } 
  })
  
```

### To list all config and device in backend

`Javascript`
```js
socket.emit('get-device-list','');
socket.emit('get-config-list','');

# get zoom json string for given config is

socket.emit('get-zoom', { id: '1' });
```

`Python`
```py
sio.on('device-list', '')
sio.on('config-list', '')

socket.on('zoom-data', ()=> {})
```

### and can be received by 

`Javascript`
```js
socket.on('device-list', (data) => {
  console.log('received device data', data)
});
```
`Python`
```py
@sio.on('config-list')
def device_data(data):
    print(data)
```

### If any errors it will be emitted to this event

`Javascript`
```js
socket.on('input-error', (data) => {
  console.log('received device data', data)
});
```
`Python`
```py
@sio.on('input-error')
def device_data(data):
    print(data)
```

## 


## `src/api` All Api Routes

Note: All `src/api/*-admin.js` are exposed as ADMIN usage like from ML Engine or Admin purpose to bypass token validation. 
All Endpoints are for CRUD purpose.

### `src/api/detection`

Used to get detections list

### `src/api/monitor`

Used for monitor CRUD

### `src/api/report`

Report endpoint to fetch Monitor,Vod and Detection at once.

### Endpoint Paradigm

For fetching data with queries, pagination, visit sequelize.

Most commonly used are `Model.findAll`, `Model.findAndCountAll`, `Model.findOne`

We use eager loading in most cases to load data with relation. For example, loading a `Monitor` with `include` of `Vod` will load vod of the monitor as well.

## `src/models` All Sequelize Models

### `src/models/alert-log`

The Alert Log (When an alert is sent out as a record)

### `src/models/alert`

The Alert set for each monitor

### `src/models/monitor`

The Monitor

### `src/models/puller`

The Puller Instance (For Monitor)

### `src/models/server`

The Puller Server 

### `src/models/vod`

The VOD playback. belongs to monitor


## `src/lib` All Lib Utils

### `src/lib/aws`

AWS lib wrapper

### `src/lib/db`

DB wrapper of sequelize

### `src/lib/s3`

S3 Wrapper for S3 (Digital Ocean For Now).

### `src/lib/alert/email`

The Email Sender Helper. Check Email Template in `emails/`, we use pug for html rendering.

### `src/lib/validateToken`

Helper function to validate whether a JWT token is valid (Cognito)

## `src/middleware`

The middleware helper

### `src/middleware/authentication`

The verify functions for JWT token to decide wether a request is valid or not.

