const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const Track = require("./track");
// const User = require("./user");

const gameConfigSchema = new Schema({
  negativeVote: Boolean,
  _id: false,
});

const gameSchema = new Schema({
  title: String,
  config: gameConfigSchema,
  leader: User,
  tracks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Track",
    },
  ],
  players: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      tracksSubmitted: Boolean,
      votesSubmitted: Boolean,
    },
  ],
});

module.exports = mongoose.model("game", gameSchema);
