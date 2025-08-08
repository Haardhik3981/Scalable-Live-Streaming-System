const { Kafka, Partitioners } = require("kafkajs");

let producer;
let isConnected = false;

let sendKafkaMessage = async () => {
  console.warn("⚠️ Kafka producer not initialized — skipping send");
};

if (process.env.NODE_ENV !== "consumer") {
  const kafka = new Kafka({
    clientId: "live-streaming-platform",
    brokers: ["kafka:9092"], // used by Docker-based backend
  });

  producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
  });

  sendKafkaMessage = async (topic, key, value) => {
    if (!isConnected) {
      await producer.connect();
      console.log("🚀 Kafka producer connected");
      isConnected = true;
    }

    return producer.send({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(value),
        },
      ],
    });
  };
}

module.exports = sendKafkaMessage;
