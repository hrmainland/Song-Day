const express = require("express");
const router = express.Router();
const Track = require("../models/track");

router.delete("/:trackId", async (req, res) => {
  const { trackId } = req.params;
  try {
    await Track.findByIdAndDelete(trackId);
    res.status(200).json({ message: `Deleted track with id ${trackId}` });
  } catch (error) {
    res.status(500).json({ error: "Error deleting track" });
  }
});

router.post("/", async (req, res) => {
  const { spotifyId, name, artists, img, submittedBy } = req.body;

  const track = new Track({
    spotifyId,
    name,
    artists,
    img,
    submittedBy,
  });
  try {
    const savedTrack = await track.save();
    res.status(200).json(savedTrack);
  } catch (error) {
    res.status(500).json({ error: "Error creating track" });
  }
});

// Wrapper for deleting track
router.deleteTrack = async (trackId) => {
  try {
    await Track.findByIdAndDelete(trackId);
    return { message: `Deleted track with id ${trackId}` };
  } catch (error) {
    throw new Error("Error deleting track");
  }
};

module.exports = router;
