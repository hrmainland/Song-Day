if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "../.env" });
}

const bodyParser = require("body-parser");

const cors = require("cors");
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const querystring = require("querystring");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const browserSessionRouter = require("./routes/test_browserSession.js");
const userRouter = require("./routes/user.js");
const gameRouter = require("./routes/game.js");
const trackGroupRouter = require("./routes/trackGroup.js");
const spotifyRouter = require("./routes/spotify.js");

const devRouter = require("./routes/test_dev.js");

const User = require("./models/user.js");

// ************************** passport
const passport = require("passport");

const port = process.env.PORT || 3500;
const dbUrl = process.env.DB_URL
const sessionSecret = process.env.SESSION_SECRET

// this is what gets stored in the session
// called once after login
passport.serializeUser(function (user, done) {
  done(null, user._id);
});

// this populates req.user
passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const sessionConfig = {
  store: MongoStore.create({ 
    mongoUrl: dbUrl,
    collectionName: "sessions",
    ttl: 24 * 60 * 60,
  }),
  name: "session",
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // TODO update this when all domains point to songday.co
    // secure: process.env.NODE_ENV === "production",
    // secure: true,
    sameSite: 'lax',
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(cors());
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// this uses the express-session middleware
app.use(passport.session());

app.use("/browser-session", browserSessionRouter);
app.use("/user", userRouter);
app.use("/game", gameRouter);
app.use("/track-group", trackGroupRouter);
app.use("/spotify", spotifyRouter);

app.use("/dev", devRouter);

app.use((err, req, res, next) => {
  console.error(err); // Log the full error server-side
  res.status(500).json({ error: "An unexpected error occurred" });
});

async function main() {
  mongoose.connect(dbUrl);
  console.log("Connection Open - Yay");
}

main().catch((err) => console.log(err));

// ############################################

if (process.env.NODE_ENV !== "dev") {
  // Serve static files from the 'dist' directory
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Define a catch-all route to serve the main HTML file
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

// ############################################

app.listen(port, () => console.log(`Listening on port ${port}`));
