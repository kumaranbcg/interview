const AWS = require("aws-sdk");

// Configure client for use with Spaces
const spacesEndpoint = new AWS.Endpoint("sgp1.digitaloceanspaces.com");
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: "FKGBHQBS7MVZGBOHVF27",
  secretAccessKey: "ZVMJ1kwSZRAD+H5d5uXasE2iludw8i0VLKqrzto+HMw"
});

module.exports = s3;
