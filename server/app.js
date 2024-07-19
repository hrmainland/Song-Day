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

const sessionRouter = require("./routes/session.js");
const userRouter = require("./routes/user.js");
const gameRouter = require("./routes/game.js");
const trackGroupRouter = require("./routes/trackGroup.js");

const devRouter = require("./routes/dev.js");
const padRouter = require("./routes/pad.js");

const User = require("./models/user.js");

// ************************** passport
const passport = require("passport");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// TODO update secret
const sessionConfig = {
  //   store,
  name: "session",
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

const port = process.env.PORT || 3500;
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/song-day";
// const dbUrl = "mongodb://127.0.0.1:27017/song-day";

app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(cors());
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// can these be here?
// ************************** passport
// app.use(passport.initialize());
app.use(passport.session());

const userRouteSuffix = "/user";
const callbackSuffix = "/callback";
const redirectSuffix = "/";

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

app.use("/session", sessionRouter);
app.use("/user", userRouter);
app.use("/game", gameRouter);
app.use("/track-group", trackGroupRouter);

app.use("/dev", devRouter);
app.use("/pad", padRouter);

// TODO - something about this
app.use((err, req, res, next) => {
  res.send(`${err}`);
});

async function main() {
  await mongoose.connect(dbUrl);
  console.log("Connection Open - Yay");
  // quickSeedTracks()
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
