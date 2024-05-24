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
// const spotifyRouter = require("./routes/spotify.js");
const userRouter = require("./routes/user.js");

// TODO update secret
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

const port = process.env.PORT || 3500;
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/song-day";
// const dbUrl = "mongodb://127.0.0.1:27017/song-day";

app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(cors());
app.use("/dev", devRouter);
// app.use("/spotify", spotifyRouter);
app.use("/user", userRouter);

async function main() {
  await mongoose.connect(dbUrl);
  console.log("Connection Open - Yay");
  // quickSeedTracks()
}

main().catch((err) => console.log(err));

// ############################################

// For test and deploy set NODE_ENV to "test" (and update urlPrefix in client)

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
