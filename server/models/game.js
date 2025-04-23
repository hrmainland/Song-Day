const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TrackGroup = require("./trackGroup");
const VoteGroup = require("./voteGroup");
const User = require("./user");

const gameConfigSchema = new Schema({
  nSongs: Number,
  nVotes: Number,
  negativeVote: Boolean,
  _id: false,
});

const playerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  displayName: String,
  _id: false,
});

const gameSchema = new Schema({
  title: String,
  config: gameConfigSchema,
  gameCode: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  playlistId: String,
status: {
    type: String,
    enum: ["add", "vote", "completed"],
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  players: [playerSchema],
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

