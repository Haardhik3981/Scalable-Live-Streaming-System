const Stream = require("../models/stream");

exports.getAllStreams = async (req, res) => {
  const streams = await Stream.find();
  res.json(streams);
};

exports.createStream = async (req, res) => {
  const stream = new Stream(req.body);
  await stream.save();
  res.status(201).json(stream);
};

exports.updateStreamStatus = async (req, res) => {
  const { id } = req.params;
  const { isLive } = req.body;
  const stream = await Stream.findByIdAndUpdate(id, { isLive }, { new: true });
  res.json(stream);
};