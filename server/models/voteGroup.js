const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Track = require("./track");
const User = require("./user");

const voteGroupSchema = new Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tracks: [
    {
      track: {
        type: Schema.Types.ObjectId,
        ref: "Track",
        required: true,
      },
      vote: {
        type: Number,
        required: true,
      },
    },
  ],
  submitted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("VoteGroup", voteGroupSchema);
