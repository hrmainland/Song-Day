if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "../.env" });
}
const cors = require("cors");
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const querystring = require("querystring");
const session = require("express-session");

const devRouter = require("./routes/dev.js");
const spotifyRouter = require("./routes/spotify.js");

const sessionConfig = {
  //   store,
  name: "session",
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

const port = process.env.PORT || 3500;
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/song-day";

app.use(cors());
app.use("/dev", devRouter);
// app.use("/spotify", spotifyRouter);

async function main() {
  await mongoose.connect(dbUrl);
  console.log("Connection Open - Yay");
  // quickSeedTracks()
}

main().catch((err) => console.log(err));

// // Serve static files from the 'dist' directory
// app.use(express.static(path.join(__dirname, "../client/dist")));

// // Define a catch-all route to serve the main HTML file
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist/index.html"));
// });

app.listen(port, () => console.log(`Listening on port ${port}`));

const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const User = require("./models/user");

app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      callbackURL: `http://localhost:${port}/spotify/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, expires_in, profile, done) => {
      const existingUser = await User.findOne({ spotify_id: profile.id });
      console.log(accessToken);

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

// const passport = require("passport");
// const SpotifyStrategy = require("passport-spotify").Strategy;
// const User = require("./models/user");

app.get("/spotify/displayName", (req, res, next) => {
  if (req.user !== undefined) {
    res.json(req.user.spotify_display_name);
  } else {
    res.json("None");
  }
});

// Authentication routes
app.get(
  "/spotify/auth",
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

app.get(
  "/spotify/callback", // Assuming authCallbackPath is "/callback"
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
