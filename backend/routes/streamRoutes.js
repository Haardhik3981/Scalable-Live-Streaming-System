const express = require("express");
const router = express.Router();
const Stream = require("../models/stream");
const redisClient = require("../redisClient");

const {
    getAllStreams,
    createStream,
    updateStreamStatus,
  } = require("../controllers/streamController");

router.get("/", getAllStreams);
router.post("/", createStream);
router.put("/key/:streamKey/status", async (req, res) => {
  try {
    console.log("PUT /key/:streamKey/status called with:", req.params.streamKey, req.body);
    const stream = await Stream.findOneAndUpdate(
      { streamKey: req.params.streamKey },
      { isLive: req.body.isLive },
      { new: true }
    );
    console.log("Updated stream:", stream);
    res.json(stream);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

router.get("/viewers/:streamKey", async (req, res) => {
  const { streamKey } = req.params;
  try {
    const count = await redisClient.get(`viewer_count:${streamKey}`);
    res.json({ viewerCount: parseInt(count) || 0 });
  } catch (err) {
    console.error("Error getting viewer count:", err);
    res.status(500).json({ error: "Failed to get viewer count" });
  }
});

module.exports = router;