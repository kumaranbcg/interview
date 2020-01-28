# Customindz Backend Documentation

The user authentication is made using cognito and permissions are being managed in mysql


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

