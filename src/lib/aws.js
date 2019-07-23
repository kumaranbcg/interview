const AWS = require("aws-sdk");
const path = require("path");
AWS.config.loadFromPath(path.join(__dirname, "..", "awsKey.json"));
AWS.config.update({ region: "ap-southeast-1" });

module.exports = AWS;
