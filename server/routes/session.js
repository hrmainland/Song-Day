const express = require("express");
const router = express.Router();
const Game = require("../models/game");
const { MongoClient, ObjectId } = require("mongodb");

// router.get("/all-sessions/:id", async (req, res) => {
//   const { id } = req.params;
//   const sessions = await Game.find({ host: new ObjectId(id) });
//   res.status(200).json(sessions);
// });

router.get("/all", (req, res) => {
  res.status(200).json(req.session);
});

router.put("/:key/:value", (req, res) => {
  const key = req.params.key;
  const value = req.params.value;
  req.session[key] = value;
  res.status(200).json({ key, value });
});

router.get("/:key", (req, res) => {
  const key = req.params.key;
  const value = req.session[key];
  if (value !== undefined) {
    res.status(200).json({ key, value });
  } else {
    res.status(404).json({ error: `Session key '${key}' not found` });
  }
});

module.exports = router;
