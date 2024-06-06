const express = require("express");
const router = express.Router();

router.get("/bla", (req, res) => {
  res.send("bla");
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
