const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: "AKIAZRF7Z3PJQUKDMOMR",
  secretAccessKey: "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"
});

module.exports = s3;
