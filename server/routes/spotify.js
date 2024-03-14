const express = require("express");
const router = express.Router();
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const User = require("../models/user");

router.get("/displayName", (req, res) => {
  if (req.user !== undefined) {
    res.json(req.user.spotify_display_name);
  }
  res.json("None");
});

// Authentication routes
router.get(
  "/auth",
  passport.authenticate("spotify", {
    scope: [
      "user-read-private", // Read access to user's private information
      "user-read-email", // Read access to user's email address
      "playlist-read-private", // Read access to user's private playlists
      "playlist-modify-public", // Write access to a user's public playlists
    ],
    showDialog: true,
  })
);

router.get(
  "/callback", // Assuming authCallbackPath is "/callback"
  passport.authenticate("spotify", { failureRedirect: "/login" }),
  (req, res) => {
    // res.json({
    //   accessToken: req.user.access_token,
    //   refreshToken: req.user.refresh_token,
    //   displayName: req.user.spotify_display_name,
    // });
    res.redirect("http://localhost:5173/new-session?");
  }
);

module.exports = router;
