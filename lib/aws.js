const AWS = require("aws-sdk");
AWS.config.loadFromPath("../awsKey.json");
AWS.config.update({ region: "ap-southeast-1" });

module.exports = AWS;
