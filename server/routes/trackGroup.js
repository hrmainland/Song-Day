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
    try {
      // First find the track group to check authorization
      const trackGroup = await TrackGroup.findById(id);

      if (!trackGroup) {
        return res.status(404).json({ error: "Track group not found" });
      }

      // Check if the user owns this track group
      if (!trackGroup.player.equals(req.user._id)) {
        return res.status(403).json({ error: "Not authorized to delete this track group" });
      }

      // If authorization passes, delete the track group
      await TrackGroup.findByIdAndDelete(id);
      return res.status(200).json({ message: `Deleted track group with id ${id}` });
    } catch (error) {
      return res.status(500).json({
        error: "Error deleting track group"
      });
    }
  }
);

module.exports = router;
