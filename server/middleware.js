const Game = require("./models/game");

module.exports.isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "User not logged in" });
  }
  next();
};

module.exports.isAuthorized = function (req, res, next) {
  const game = req.game;
  const isAuthorized = game.players.some((entry) =>
    entry.user.equals(req.user._id)
  );
  if (!isAuthorized) {
    return res.status(403).json({ error: "User not authorized" });
  }
  next();
};

/**
 * Checks a game for duplicate track or vote groups from the same player and removes them.
 * If duplicates are found, the game is updated with the new (non-duplicate) lists.
 * @param {Game} game - The game to check for duplicates.
 * @returns {Promise<void>}
 */
async function removeDuplicateGroups(game) {
  const uniqueTrackGroups = new Map();
  const uniqueVoteGroups = new Map();
  let foundDuplicate = false;

  if (game.trackGroups) {
    game.trackGroups.forEach((trackGroup) => {
      if (!uniqueTrackGroups.has(trackGroup.player.toString())) {
        uniqueTrackGroups.set(trackGroup.player.toString(), trackGroup);
      } else {
        foundDuplicate = true;
      }
    });
  }

  if (game.voteGroups) {
    game.voteGroups.forEach((voteGroup) => {
      if (!uniqueVoteGroups.has(voteGroup.player.toString())) {
        uniqueVoteGroups.set(voteGroup.player.toString(), voteGroup);
      } else {
        foundDuplicate = true;
      }
    });
  }

  if (foundDuplicate) {
    game.trackGroups = [...uniqueTrackGroups.values()];
    game.voteGroups = [...uniqueVoteGroups.values()];
    await game.save();
  }
}

// adds game to req
module.exports.findGame = async function (req, res, next) {
  const { gameId } = req.params;
  const game = await Game.findById(gameId)
    .populate("trackGroups")
    .populate("voteGroups");

  await removeDuplicateGroups(game);

  if (!game) {
    res.status(404).json({ message: `No game found with ID ${gameId}` });
    return;
  }
  req.game = game;
  next();
};
