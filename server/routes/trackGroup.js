const bodyParser = require("body-parser");
const express = require("express");
const Game = require("../models/game");
const TrackGroup = require("../models/trackGroup");
const Track = require("../models/track");
const router = express.Router();
const generateGameCode = require("../utils/gameCode");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const { MongoClient, ObjectId } = require("mongodb");
const { rawListeners } = require("../models/track");

router.get("/", (req, res) => {
  res.send("it works home");
});

router.post("/", async (req, res, next) => {
  const { sessionTracks } = req.body;

  var tracks = [];

  for (let sessionTrack of sessionTracks) {
    const { name, artists, img } = sessionTrack;
    TrackParams = {
      spotifyId: sessionTrack.id,
      name,
      artists,
      img,
      submittedBy: req.user._id,
    };
    thisTrack = new Track(TrackParams);
    await thisTrack.save();
    tracks.push(thisTrack.id);
  }

  trackGroupParams = { player: req.user._id, tracks };

  const trackGroup = new TrackGroup(trackGroupParams);
  await trackGroup.save();

  res.status(200).json(trackGroup);
});

module.exports = router;
