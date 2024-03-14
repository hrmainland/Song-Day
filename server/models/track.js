const mongoose = require("mongoose");
const Schema = mongoose.Schema

const trackSchema = new Schema({
    title: String,
    spotify_id: String
})

module.exports = mongoose.model("track", trackSchema);
