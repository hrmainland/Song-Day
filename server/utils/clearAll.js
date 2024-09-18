const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/../../.env" });

const Game = require("../models/game");
const Track = require("../models/track");
const TrackGroup = require("../models/trackGroup");
const User = require("../models/user");

const dbUrl = process.env.DB_URL;
console.log("process.env.DB_URL :>> ", process.env.DB_URL);
async function deleteAllDocuments() {
  try {
    await Game.deleteMany({});
    await Track.deleteMany({});
    await TrackGroup.deleteMany({});
    await User.deleteMany({});
    console.log("All documents deleted successfully.");
  } catch (error) {
    console.error("Error deleting documents:", error);
  }
}

async function main() {
  await mongoose.connect(dbUrl);
  console.log("Connection Open - Yay");
  await deleteAllDocuments();
  await mongoose.connection.close();
  console.log("Connection Closed - Goodbye");
}

main().catch((err) => console.log(err));
