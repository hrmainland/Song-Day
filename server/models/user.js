const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  spotify_id: { type: String, unique: true },
  spotify_display_name: String,
  access_token: String,
  refresh_token: String,
});

module.exports = mongoose.model("user", userSchema);
