const bodyParser = require("body-parser");
const express = require("express");
const Game = require("../models/game");
const TrackGroup = require("../models/trackGroup");
// const Track = require("../models/track");
const router = express.Router();
const generateGameCode = require("../utils/gameCode");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const { MongoClient, ObjectId } = require("mongodb");


// this is unused at the Track overhaul
router.delete("/track/:trackId", async (req, res) => {
  const { trackId } = req.params;
  try {
    await Track.findByIdAndDelete(trackId);
    // TODO add logic if the track does not exist, currently looks like a success
    res.status(200).json({ message: `Deleted track with id ${trackId}` });
  } catch (error) {
    res.status(500).json({ error: "Error deleting track" });
  }
});

router.post("/", async (req, res, next) => {
  const { sessionTracks } = req.body;

  const trackIds = sessionTracks.map(({ id }) => id);

  trackGroupParams = { player: req.user._id, trackIds };

  const trackGroup = new TrackGroup(trackGroupParams);
  await trackGroup.save();

  res.status(200).json(trackGroup);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const trackGroup = await TrackGroup.findById(id);
  for (let trackId of trackGroup.tracks) {
    const res = await trackRouter.deleteTrack(trackId);
    if (res.status !== 200) {
      res.status(500).json({
        error: `Error deleting track with id ${trackId}. Could not delete track group as result.`,
      });
      return;
    }
  }
  try {
    await TrackGroup.findByIdAndDelete(id);
    res.status(200).json({ message: `Deleted track group with id ${id}` });
  } catch (error) {
    res.status(500).json({
      error: `Error deleting track group with id ${id}.`,
    });
  }
});

module.exports = router;
