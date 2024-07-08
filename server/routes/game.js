const bodyParser = require("body-parser");
const express = require("express");
const Game = require("../models/game");
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
  console.log("game :>> ", game);
  game.players.push(req.user._id);
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

// TODO put this in useEffect
router.get("/:gameCode", async (req, res) => {
  const { gameCode } = req.params;
  const game = await Game.findOne({ gameCode });
  if (game != undefined) {
    res.status(200).json(game);
  } else {
    res.status(404).json({ error: `Game with code '${gameCode}' not found` });
  }
});

module.exports = router;
