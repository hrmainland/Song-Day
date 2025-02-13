const express = require("express");
const router = express.Router();

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
