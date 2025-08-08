const mongoose = require("mongoose");

const streamSchema = new mongoose.Schema({
  streamerName: String,
  streamKey: String,
  title: String,
  description: String,
  isLive: { type: Boolean, default: false },
});

module.exports = mongoose.model("Stream", streamSchema);//Exports the model so it can be used elsewhere in the app.