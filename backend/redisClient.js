// redisClient.js
const redis = require("redis");

const client = redis.createClient({
  url: "redis://redis:6379",
});

client.connect()
  .then(() => console.log("🔗 Connected to Redis"))
  .catch((err) => console.error("Redis connection error:", err));

module.exports = client;
