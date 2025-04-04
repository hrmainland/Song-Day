const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const voteGroupSchema = new Schema({
  player: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      _id: false,
      trackId: {
        type: String,
      },
      vote: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("VoteGroup", voteGroupSchema);
