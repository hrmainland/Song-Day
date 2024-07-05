const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Game = require("./game");

const userSchema = new Schema({
  name: String,
  spotify_id: { type: String, unique: true },
  spotify_display_name: String,
  access_token: String,
  refresh_token: String,
  games: [
    {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
