const express = require("express");
const router = express.Router();
const Track = require("../models/track");

async function trackTitles() {
  const tracks = await Track.find({});
  const titles = tracks.map((track) => track.name);
  return titles;
}

// router.get("/", (req, res) => {
//   res.send("hello");
// })

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

router.get("/dingo", (req, res) => {
  res.send(req.user);
});

module.exports = router;
