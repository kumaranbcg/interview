var Minio = require("minio");

var minioClient = new Minio.Client({
  endPoint: "54.255.150.76",
  port: 9000,
  useSSL: false,
  accessKey: "viact",
  secretKey: "viact-secret-key"
});

module.exports = minioClient;
