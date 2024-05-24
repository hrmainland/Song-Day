const express = require("express");
const router = express.Router();
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const User = require("../models/user");

const userRouteSuffix = "/user";
const callbackSuffix = "/callback";
const redirectSuffix = "/new-session";

// set callback url and redirect url based on the envrionment
if (process.env.NODE_ENV === "production") {
  clientUrlBase = process.env.RENDER_EXTERNAL_URL;
  serverUrlBase = process.env.RENDER_EXTERNAL_URL;
} else {
  clientUrlBase = process.env.CLIENT_URL_BASE;
  serverUrlBase = process.env.SERVER_URL_BASE;
}
const callbackUrl = serverUrlBase + userRouteSuffix + callbackSuffix;
const redirectUrl = clientUrlBase + redirectSuffix;

router.use(passport.initialize());
router.use(passport.session());
router.use(express.json());

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: callbackUrl,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, expires_in, profile, done) => {
      const existingUser = await User.findOne({ spotify_id: profile.id });

      if (existingUser) {
        existingUser.access_token = accessToken;
        existingUser.refresh_token = refreshToken;
        existingUser.spotify_display_name = profile.displayName;
        await existingUser.save();
        done(null, existingUser);
      } else {
        const newUser = new User({
          spotify_id: profile.id,
          spotify_display_name: profile.displayName,
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        await newUser.save();
        done(null, newUser);
      }
    }
  )
);

router.get("/display-name", (req, res) => {
  if (req.user !== undefined) {
    res.json(req.user.spotify_display_name);
  } else {
    res.json("None");
  }
});

router.get("/isLoggedIn", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.send("You're logged in");
  } else {
    res.send("not logged in");
  }
});

// Authentication route this adds the current User to req.user once you're in
router.get(
  "/auth",
  (req, res, next) => {
    const jeff = req.query.jeff;
    console.log(jeff);
    next();
  },
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
    res.redirect(redirectUrl);
  }
);

module.exports = router;
