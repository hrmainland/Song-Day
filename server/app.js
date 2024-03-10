if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const cors = require("cors");
const request = require("request");
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
// const port = process.env.PORT || 3500;
const port = 3500;

app.get("/players", async (req, res) => {
  var list = ["Mark", "Timmy", "Mary", "James"];
  res.json(list);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
