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
const { validate, trackGroupValidators } = require("../validators");
// Note: No sanitization needed for trackGroup routes as they only contain IDs and references, not user-generated text


router.post(
  "/",
  trackGroupValidators.createTrackGroup,
  validate,
  isLoggedIn,
  async (req, res, next) => {
    const { sessionTracks } = req.body;

    const trackIds = sessionTracks.map(({ id }) => id);

    trackGroupParams = { player: req.user._id, trackIds };

    const trackGroup = new TrackGroup(trackGroupParams);
    await trackGroup.save();

    res.status(200).json(trackGroup);
  }
);

router.delete(
  "/:id",
  trackGroupValidators.deleteTrackGroup,
  validate,
  isLoggedIn,
  async (req, res) => {
    const { id } = req.params;
    const trackGroup = await TrackGroup.findById(id);
    try {
      await TrackGroup.findByIdAndDelete(id);
      res.status(200).json({ message: `Deleted track group with id ${id}` });
    } catch (error) {
      res.status(500).json({
        error: `Error deleting track group with id ${id}.`,
      });
    }
  }
);

module.exports = router;
