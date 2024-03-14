const express = require("express");
const router = express.Router();
const Track = require("../models/track");

async function trackTitles() {
  const tracks = await Track.find({});
  const titles = tracks.map((track) => track.title);
  return titles;
}

router.get("/tracks", async (req, res) => {
  const titles = await trackTitles();
  res.json(titles);
});

router.get("/setcolor", (req, res) => {
  req.session.color = "Blue";
  res.send(req.session.color);
});

router.get("/getcolor", (req, res) => {
  res.send(req.session.color);
});

router.get("/getsession", (req, res) => {
  res.send(req.session);
});

module.exports = router;
