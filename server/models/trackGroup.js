const mongoose = require("mongoose");
const Schema = mongoose.Schema;



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
});

module.exports = mongoose.model("TrackGroup", trackGroupSchema);
