const { Kafka } = require("kafkajs");

const brokerList = ["localhost:29092"];
console.log("✅ Running updated consumer.js");
console.log("🧪 Kafka broker:", brokerList);

const kafka = new Kafka({
  clientId: "viewer-consumer",
  brokers: brokerList,
});
const consumer = kafka.consumer({ groupId: "analytics-group" });

async function run() {
  await consumer.connect();
  console.log("📥 Kafka consumer connected");

  await consumer.subscribe({ topic: "viewer-events", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log(`📊 [${event.event}] Stream: ${event.streamKey}, Time: ${new Date(event.timestamp).toLocaleTimeString()}`);
    },
  });
}

run().catch(console.error);
