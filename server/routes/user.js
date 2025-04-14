const express = require("express");
const router = express.Router();
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const User = require("../models/user");
const Game = require("../models/game");
const { isLoggedIn } = require("../middleware");

const userRouteSuffix = "/user";
const callbackSuffix = "/callback";
const redirectSuffix = "/login-redirect";

// set callback url and redirect url based on the envrionment
if (process.env.NODE_ENV === "production") {
  serverUrlBase = process.env.RENDER_EXTERNAL_URL;
} else {
  clientUrlBase = process.env.CLIENT_URL_BASE;
  serverUrlBase = process.env.SERVER_URL_BASE;
}

var redirectUrl;

if (process.env.NODE_ENV === "dev") {
  redirectUrl = clientUrlBase + redirectSuffix;
} else {
  redirectUrl = serverUrlBase + redirectSuffix;
}

const callbackUrl = serverUrlBase + userRouteSuffix + callbackSuffix;

router.use(passport.initialize());
router.use(passport.session());
router.use(express.json());

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

router.get("/isLoggedIn", async (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json(true);
  }
  res.status(200).json(false);
});

// route to add game to user
router.put("/game/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);

    if (!game) {
      return res
        .status(404)
        .json({ error: `Game with code ${code} not found` });
    }

    req.user.games.push(game._id);
    await req.user.save();

    res.status(200).json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/my-games", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("games");

    // this should never happen once we have proper route protection on
    if (!user) {
      return res.status(404).send("User not found");
    }

    const games = user.games;
    res.status(200).json(games);
  } catch (error) {
    console.error("Error fetching user games:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/display-name", isLoggedIn, (req, res) => {
  if (req.user !== undefined) {
    res.json(req.user.spotify_display_name);
  } else {
    res.json("None");
  }
});

// TODO update or delete
router.get("/id", (req, res) => {
  if (req.user !== undefined) {
    res.status(200).json(req.user._id);
  } else {
    res.status(404).json("None");
  }
});

// TODO proper error handling here
router.get("/me", isLoggedIn, (req, res) => {
  if (req.user !== undefined) {
    res.status(200).json(req.user);
  } else {
    res.status(404).json("None");
  }
});

// purely for auth check
router.get("/my-id", (req, res) => {
  if (req.user !== undefined) {
    res.status(200).json(req.user._id);
  } else {
    res.status(200).json(null);
  }
});

router.get("/access-token", isLoggedIn, (req, res) => {
  res.status(200).json(req.user.access_token);
});


router.get('/refresh-token', isLoggedIn, function(req, res) {

  var refresh_token = req.user.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  console.log('authOptions :>> ', authOptions);

  router.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token,
          refresh_token = body.refresh_token || refresh_token;
    }
    else {
      console.log('error :>> ', error);
    }
  });
});

// Authentication route, this passes you to Spotify
router.get(
  "/auth",
  passport.authenticate("spotify", {
    scope: [
      "user-read-private", // Read access to user's private information
      "user-read-email", // Read access to user's email address
      "playlist-read-private", // Read access to user's private playlists
      "playlist-modify-public", // Write access to a user's public playlists
      "playlist-modify-private",
    ],
    showDialog: false,
  })
);

// callback route - Spotify passes you back here to complete the auth flow
// this exchanges the code for an access token, then serializes the user
router.get(
  "/callback", // Assuming authCallbackPath is "/callback"
  passport.authenticate("spotify", { failureRedirect: "/home" }),
  (req, res) => {
    // TODO add user here as context
    // or better just return the user ID or a failure and let the frontend handle redirect
    res.redirect(redirectUrl);
  }
);

router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    return res.status(200).json({ message: 'Successfully logged out' });
    // res.redirect(redirectUrl);
  });
});

module.exports = router;
