const Game = require("../models/game");
const Track = require("../models/track");
const TrackGroup = require("../models/trackGroup");

async function deleteAllDocuments() {
  try {
    await Game.deleteMany({});
    await Track.deleteMany({});
    await TrackGroup.deleteMany({});
    console.log("All documents deleted successfully.");
  } catch (error) {
    console.error("Error deleting documents:", error);
  }
}

deleteAllDocuments();
