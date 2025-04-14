const Game = require("./models/game");

module.exports.isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "User not logged in" });
  }
  next();
};

module.exports.isAuthorized = function (req, res, next) {
  const game = req.game;
  const isAuthorized = game.players.some((entry) => entry.user.equals(req.user._id));
  if (!isAuthorized) {
    return res.status(403).json({ error: "User not authorized" });
  }
  next();
};

// adds game to req
module.exports.findGame = async function (req, res, next) {
  const { gameId } = req.params;
  const game = await Game.findById(gameId);
  if (!game) {
    res.status(404).json({ message: `No game found with ID ${gameId}` });
    return;
  }
  req.game = game;
  next();
};
