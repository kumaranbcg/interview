let kafka = require("kafka-node"),
  Consumer = kafka.Consumer,
  client = new kafka.KafkaClient({
    kafkaHost: "http://ec2-18-191-212-166.us-east-2.compute.amazonaws.com:9092"
  }),
  consumer = new Consumer(
    client,
    [
      { topic: "times_square_json" },
      {
        topic: "times_square"
      }
    ],
    {
      autoCommit: false
    }
  );

consumer.on("error", err => {
  console.log(err);
});

module.exports = consumer;
