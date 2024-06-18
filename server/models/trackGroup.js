const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Track = require("./track");
const User = require("./user");

const trackGroupSchema = new Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tracks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Track",
    },
  ],
  submitted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("trackGroup", trackGroupSchema);
