# Customindz Backend Documentation

The user authentication is made using cognito and permissions are being managed in mysql

## Zoom Level and Devices using socket
The jetson nano device will be connected to the server via socket.io

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

### To create a device 


`Javascript`
```js
socket.emit('create-device', { config:1 });
```
`Python`
```py
socket.emit('create-device', { config:1 });
```

### Jetson will be identified by device id it has stored in code

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
  config: 2, 
  order: 1
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
sio.emit('update-device', {id:1,config:2,order:1})
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

