const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const streamRoutes = require("./routes/streamRoutes");
const redisClient = require("./redisClient");
const sendKafkaMessage = require("./kafkaClient");

dotenv.config();

const app = express();
const server = http.createServer(app); // needed for socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
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
console.log("👉 Connecting to MongoDB at:", process.env.MONGODB_URI);
mongoose
  .connect("mongodb+srv://haardhiknbd:MA%40Santacruz99.@cluster0.q9uozpc.mongodb.net/livestream?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("🟢 MongoDB connected");
    server.listen(5050, () => console.log("🚀 Server running on port 5050"));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
