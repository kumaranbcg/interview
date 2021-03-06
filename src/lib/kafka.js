let kafka = require("kafka-node"),
  Consumer = kafka.ConsumerGroup,
  consumer = new Consumer(
    {
      kafkaHost: "3.14.171.17:9092",
      groupId: "Kafka-Middle-Server"
    },
    "times_square_json"
  );

consumer.on("error", err => {
  console.log(err);
});

consumer.on("message", function(message) {
  console.log(message);
});

module.exports = consumer;
