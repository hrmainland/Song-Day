const bodyParser = require("body-parser");
const express = require("express");
const Game = require("../models/game");
const router = express.Router();
const generateGameCode = require("../utils/gameCode");
const passport = require("passport");

const isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    console.log("not logged in");
  }
  console.log("logged in");
  next();
};

router.post("/new", async (req, res, next) => {
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
  };

  const thisGame = new Game(params);
  await thisGame.save();

  // Send a response back to the client
  res.status(200).json({
    message: "Game created successfully",
    gameName,
    numSongs,
    gameCode,
  });
});

// TODO put this in useEffect
router.get("/:gameCode", async (req, res) => {
  const { gameCode } = req.params;
  const game = await Game.findOne({ gameCode });
  if (game != undefined) {
    res.status(200).json(game);
  } else {
    res.status(400).json({ error: `Game with code '${gameCode}' not found` });
  }
});

module.exports = router;
