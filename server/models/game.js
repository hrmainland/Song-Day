const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TrackGroup = require("./trackGroup");
const VoteGroup = require("./voteGroup");
const User = require("./user");

const gameConfigSchema = new Schema({
  nSongs: Number,
  negativeVote: Boolean,
  _id: false,
});

const gameSchema = new Schema({
  title: String,
  config: gameConfigSchema,
  gameCode: String,
  host: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  trackGroups: [
    {
      type: Schema.Types.ObjectId,
      ref: "TrackGroup",
    },
  ],
  voteGroups: [
    {
      type: Schema.Types.ObjectId,
      ref: "VoteGroup",
    },
  ],
});

module.exports = mongoose.model("Game", gameSchema);
