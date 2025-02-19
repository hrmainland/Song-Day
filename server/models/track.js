const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trackSchema = new Schema({
  spotifyId: {
    type: String,
    required: true,
  },
  name: String,
  artists: String,
  img: String,
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// module.exports = mongoose.model("Track", trackSchema);
