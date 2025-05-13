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
const csrf = require('csurf');

const browserSessionRouter = require("./routes/test_browserSession.js");
const userRouter = require("./routes/user.js");
const gameRouter = require("./routes/game.js");
const trackGroupRouter = require("./routes/trackGroup.js");
const spotifyRouter = require("./routes/spotify.js");
const { setCsrfCookie } = require("./middleware/csrfMiddleware");

const devRouter = require("./routes/test_dev.js");

const User = require("./models/user.js");

const passport = require("passport");

const port = process.env.PORT || 3500;
const dbUrl = process.env.DB_URL
const sessionSecret = process.env.SESSION_SECRET

if (process.env.NODE_ENV === 'production') {
  // Trust the proxy so Express can detect secure connections correctly
  app.set('trust proxy', 1);
}

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

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
    secure: process.env.NODE_ENV === "production",
    sameSite: 'lax',
    expires: Date.now() + 1000 * 60 * 60 * 24 * 5,
    maxAge: 1000 * 60 * 60 * 24 * 5,
  },
};

app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(cors());
// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use(passport.session());

const csrfProtection = csrf({ cookie: false });

app.get('/csrf-token', (req, res) => {
  req.session.touch();

  try {
    csrfProtection(req, res, (err) => {
      if (err) {
        console.error('CSRF Error:', err);
        return res.status(500).json({ error: 'Failed to establish CSRF protection', details: err.message });
      }

      // Generate and return token
      const token = req.csrfToken();
      res.json({ csrfToken: token });
    });
  } catch (error) {
    console.error('Exception in CSRF endpoint:', error);
    res.status(500).json({ error: 'Exception in CSRF endpoint', details: error.message });
  }
});

app.use("/user", csrfProtection, userRouter);
app.use("/game", csrfProtection, gameRouter);
app.use("/track-group", csrfProtection, trackGroupRouter);
app.use("/spotify", csrfProtection, spotifyRouter);


app.use("/dev", devRouter);

app.use((err, req, res, next) => {
  console.error(err);

  // Handle CSRF errors specifically
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      error: "Invalid CSRF token. Request denied for security reasons.",
      code: "CSRF_ERROR"
    });
  }

  // Handle other errors
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
