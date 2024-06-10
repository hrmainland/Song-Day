const bodyParser = require("body-parser");
const express = require("express");
const Game = require("../models/game");
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("req.params :>> ", req.params);
  console.log("req.query :>> ", req.query);
  console.log("req.body :>> ", req.body);
  res.send("game");
});

router.get("/test", (req, res) => {
  res.send("it works");
});

router.post("/new", async (req, res, next) => {
  const { gameName, numSongs, players } = req.body;
  console.log("Game Name:", gameName);
  console.log("Number of Songs:", numSongs);
  console.log("Players:", players);

  // Send a response back to the client
  res.json({ message: "Game created successfully", gameName, numSongs });
});

module.exports = router;
