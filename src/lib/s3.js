const AWS = require("aws-sdk");

// Configure client for use with Spaces
const spacesEndpoint = new AWS.Endpoint("sgp1.digitaloceanspaces.com");
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: "GY4GRBWJ5HJYUZRSMYHA",
  secretAccessKey: "J6ta27Cp8t9GO+hiJcz0EmSdqEfbYDmuPmhaEAs44Po"
});

module.exports = s3;
