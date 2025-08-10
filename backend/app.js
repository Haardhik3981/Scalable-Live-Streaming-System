const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const streamRoutes = require("./routes/streamRoutes");
const redisClient = require("./redisClient");
const sendKafkaMessage = require("./kafkaClient");
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://haardhiksimplestream.live",
  "https://www.haardhiksimplestream.live",
  "https://cdn.haardhiksimplestream.live",
  "https://api.haardhiksimplestream.live",
  "http://100.64.8.207:3000",
  "https://scalable-live-streaming-system.pages.dev",
];

const app = express();
const server = http.createServer(app); // needed for socket.io
app.use(cors({ origin: allowedOrigins }));
app.set("trust proxy", true);
const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ["GET", "POST", "OPTIONS"] },
  path: "/socket.io/",
});

dotenv.config();



app.use(express.json());
app.use("/api/streams", streamRoutes);

// Redis-based viewer tracking
io.on("connection", (socket) => {
  console.log("⚡ New viewer connected");

  console.log("⚡ New viewer connected");

  socket.on("viewer:join", async ({ streamKey }) => {
    const key = `viewer_count:${streamKey}`;
    await redisClient.incr(key);
    console.log(`👤 Viewer joined stream ${streamKey}`);

    await sendKafkaMessage("viewer-events", "join", {
      event: "join",
      streamKey,
      timestamp: Date.now(),
    });
    
  });

  socket.on("viewer:leave", async ({ streamKey }) => {
    const key = `viewer_count:${streamKey}`;
    await redisClient.decr(key);
    console.log(`👤 Viewer left stream ${streamKey}`);

    await sendKafkaMessage("viewer-events", "leave", {
      event: "leave",
      streamKey,
      timestamp: Date.now(),
    });
    
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🟢 MongoDB connected");
    server.listen(5050, () => console.log("🚀 Server running on port 5050"));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
