const express = require("express");
const router = express.Router();
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const User = require("../models/user");
const Game = require("../models/game");
const { isLoggedIn } = require("../middleware");
const { sanitizeParams } = require("../middleware/sanitize");
const { validate, userValidators } = require("../validators");

const userRouteSuffix = "/user";
const callbackSuffix = "/callback";
const redirectSuffix = "/login-redirect";

// set callback url and redirect url based on the envrionment
if (process.env.NODE_ENV === "production") {
  serverUrlBase = process.env.PUBLIC_BASE_URL;
} else {
  clientUrlBase = process.env.CLIENT_URL_BASE;
  serverUrlBase = process.env.SERVER_URL_BASE;
}

var redirectUrl;

if (process.env.NODE_ENV === "production") {
  redirectUrl = serverUrlBase + redirectSuffix;
} else {
  redirectUrl = clientUrlBase + redirectSuffix;
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

      // Calculate token expiry time (subtract 5 minutes for safety)
      const expiryTime = Date.now() + (expires_in * 1000) - 300000;

      if (existingUser) {
        // Encrypt tokens before saving to database
        existingUser.setEncryptedToken('access_token', accessToken);
        existingUser.setEncryptedToken('refresh_token', refreshToken);
        existingUser.token_expiry = expiryTime;
        existingUser.spotify_display_name = profile.displayName;
        await existingUser.save();
        done(null, existingUser);
      } else {
        const newUser = new User({
          spotify_id: profile.id,
          spotify_display_name: profile.displayName,
          token_expiry: expiryTime,
        });

        // Encrypt tokens before saving to database
        newUser.setEncryptedToken('access_token', accessToken);
        newUser.setEncryptedToken('refresh_token', refreshToken);

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
router.put(
  "/game/:id",
  userValidators.addGameToUser,
  validate,
  isLoggedIn,
  async (req, res) => {
    try {
      const { id } = req.params;
      const game = await Game.findById(id);

      if (!game) {
        return res
          .status(404)
          .json({ error: `Game with id ${id} not found` });
      }

      req.user.games.push(game._id);
      await req.user.save();

      res.status(200).json(req.user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get("/my-games", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "games",
      populate: {
        path: "trackGroups"
      }
    });

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

router.get("/id", (req, res) => {
  if (req.user !== undefined) {
    res.status(200).json(req.user._id);
  } else {
    res.status(404).json("None");
  }
});

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
  // Use the virtual property to get the decrypted access token
  const accessToken = req.user.decryptedAccessToken;

  if (!accessToken) {
    return res.status(400).json({ error: "Access token not available" });
  }

  res.status(200).json(accessToken);
});


// Authentication route, this passes you to Spotify
router.get(
  "/auth",
  passport.authenticate("spotify", {
    scope: [
      "playlist-modify-public",
      "playlist-modify-private",
    ],
    showDialog: true,
  })
);

// callback route - Spotify passes you back here to complete the auth flow
router.get(
  "/callback",
  passport.authenticate("spotify", { failureRedirect: "/home" }),
  (req, res) => {
    res.redirect(redirectUrl);
  }
);

router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    return res.status(200).json({ message: 'Successfully logged out' });
  });
});

router.delete('/delete-me', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);
    req.logout(function(err) {
      if (err) { return next(err); }
      return res.status(200).json({ message: 'User deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

/**
 * Accept Terms of Service and Privacy Policy
 * @route POST /user/accept-terms
 */
router.post('/accept-terms', isLoggedIn, async (req, res) => {
  try {
    // Update the user's terms acceptance status
    await User.findByIdAndUpdate(req.user._id, {
      hasAcceptedTerms: true
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Terms accepted successfully'
    });
  } catch (error) {
    console.error('Error accepting terms:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'Failed to save terms acceptance'
    });
  }
});

/**
 * Check if user has accepted terms
 * @route GET /user/terms-status
 */
router.get('/terms-status', isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      hasAcceptedTerms: user.hasAcceptedTerms || false
    });
  } catch (error) {
    console.error('Error checking terms status:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to check terms status'
    });
  }
});

module.exports = router;
