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

router.put("/:id/add-me", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const game = await Game.findById(id);
  if (!game) {
    res.status(404).json({ message: `No game found with ID ${id}` });
    return;
  }
  game.players.push(req.user._id);
  await game.save();

  res.status(200).json(game);
});

router.put("/:id/:trackGroupId", isLoggedIn, async (req, res) => {
  const { id, trackGroupId } = req.params;
  const game = await Game.findById(id);
  if (!game) {
    res.status(404).json({ message: `No game found with ID ${id}` });
    return;
  }
  game.trackGroups.push(trackGroupId);
  await game.save();

  res.status(200).json(game);
});

router.post("/new", isLoggedIn, async (req, res, next) => {
  const { gameName, numSongs } = req.body;
  const gameCode = generateGameCode();

  const config = {
    nSongs: numSongs,
    negativeVote: false,
  };

  const userId = req.user._id;
  const params = {
    title: gameName,
    config,
    gameCode,
    host: userId,
    players: [userId],
  };

  const thisGame = new Game(params);
  await thisGame.save();

  res.status(200).json(thisGame);
});

// TODO put this in useEffect and store in cookies
router.get("/:gameCode", async (req, res) => {
  const { gameCode } = req.params;
  const game = await Game.findOne({ gameCode });
  if (game != undefined) {
    res.status(200).json(game);
  } else {
    res.status(404).json({ error: `Game with code '${gameCode}' not found` });
  }
});

router.get("/:gameId/my-submitted", isLoggedIn, async (req, res) => {
  const { gameId } = req.params;
  const game = await Game.findById(gameId).populate("trackGroups", "player");
  if (!game) {
    res.status(404).json({ message: `No game found with ID ${id}` });
    return;
  }
  for (let trackGroup of game.trackGroups) {
    if (trackGroup.player.equals(req.user._id)) {
      return res.status(200).json({ isSubmitted: true });
    }
  }
  return res.status(200).json({ isSubmitted: false });
});

router.get("/:gameId/all-tracks", async (req, res) => {
  const { gameId } = req.params;
  const game = await Game.findById(gameId).populate({
    path: "trackGroups",
    populate: {
      path: "tracks",
      model: "Track", // Ensure this is the correct model name
    },
  });
  if (!game) {
    res.status(404).json({ message: `No game found with ID ${id}` });
    return;
  }
  let tracks = [];

  for (let trackGroup of game.trackGroups) {
    tracks = tracks.concat(trackGroup.tracks);
  }

  return res.status(200).json(tracks);
});

router.get("/:gameId/votable-tracks", async (req, res) => {
  const { gameId } = req.params;
  const game = await Game.findById(gameId).populate({
    path: "trackGroups",
    populate: {
      path: "tracks",
      model: "Track",
    },
  });
  if (!game) {
    res.status(404).json({ message: `No game found with ID ${id}` });
    return;
  }
  let tracks = [];

  for (let trackGroup of game.trackGroups) {
    if (!trackGroup.player._id.equals(req.user._id)) {
      tracks = tracks.concat(trackGroup.tracks);
    }
  }

  return res.status(200).json(tracks);
});

module.exports = router;
