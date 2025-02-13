const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const trackGroupSchema = new Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  trackIds: [{
    type: String,
  }],
});

module.exports = mongoose.model("TrackGroup", trackGroupSchema);
