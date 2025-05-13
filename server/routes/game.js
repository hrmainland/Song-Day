const bodyParser = require("body-parser");
const express = require("express");
const Game = require("../models/game");
const TrackGroup = require("../models/trackGroup");
const VoteGroup = require("../models/voteGroup");
const router = express.Router();
const generateGameCode = require("../utils/gameCode");
const passport = require("passport");
const { isLoggedIn, findGame, isAuthorized } = require("../middleware");
const { sanitizeBody, sanitizeParams } = require("../middleware/sanitize");
const { MongoClient, ObjectId } = require("mongodb");
const { validate, gameValidators } = require("../validators");
const spotifyRouter = require("./spotify");

function isAuthorizedFunc(game, user) {
  return game.players.some((entry) => entry.user.equals(user._id));
}

router.put(
  "/:gameId/add-me",
  gameValidators.addMe,
  validate,
  findGame,
  isLoggedIn,
  async (req, res) => {
    const game = req.game;
    game.players.push({ user: req.user._id, displayName: null });
    await game.save();

    res.status(200).json(game);
  }
);

router.delete(
  "/:gameId/remove-player/:userId",
  gameValidators.removePlayer,
  validate,
  findGame,
  isLoggedIn,
  isAuthorized,
  async (req, res) => {
    const { userId } = req.params;
    const game = req.game;
    game.players = game.players.filter((player) => !player.user.equals(userId));
    await game.save();
    res.status(200).json(game);
  }
);

router.put(
  "/:gameId/track-group/:trackGroupId",
  gameValidators.addTrackGroup,
  validate,
  findGame,
  isLoggedIn,
  isAuthorized,
  async (req, res) => {
    const { trackGroupId } = req.params;
    const game = req.game;

    const existingTrackGroup = game.trackGroups.find(
      (trackGroup) => trackGroup.player.equals(req.user._id)
    );
    if (existingTrackGroup) {
      return res.status(409).json({
        message: "You've already submitted a track group",
      });
    }
    game.trackGroups.push(trackGroupId);
    await game.save();

    res.status(200).json(game);
  }
);

router.post(
  "/new",
  sanitizeBody(['gameName']), // Sanitize game name before validation
  gameValidators.createGame,
  validate,
  isLoggedIn,
  async (req, res, next) => {
    const { gameName, settings } = req.body;
    const gameCode = generateGameCode();

    const config = {
      nSongs: settings.numSongs,
      nVotes: settings.numVotes,
      negativeVote: false,
    };

    const userId = req.user._id;
    const params = {
      title: gameName,
      config,
      gameCode,
      status: "add",
      host: userId,
      players: [{ user: userId, displayName: null }],
    };

    const thisGame = new Game(params);
    await thisGame.save();

    res.status(200).json(thisGame);
  }
);


router.post(
  "/:gameId/move-to-voting",
  gameValidators.moveToVoting,
  validate,
  findGame,
  isLoggedIn,
  isAuthorized,
  async (req, res) => {
    const game = req.game;
    game.status = "vote";
    await game.save();

    res.status(200).json(game);
  }
);

router.put(
  "/:gameId/display-name",
  sanitizeBody(['displayName']), // Sanitize display name before validation
  gameValidators.updateDisplayName,
  validate,
  findGame,
  isLoggedIn,
  isAuthorized,
  async (req, res) => {
    const { displayName } = req.body;
    const game = req.game;
    game.players.find((player) =>
      player.user.equals(req.user._id)
    ).displayName = displayName;
    await game.save();

    res.status(200).json({ message: "Display name updated" });
  }
);

router.post(
  "/:gameId/vote-group",
  gameValidators.createVoteGroup,
  validate,
  findGame,
  isLoggedIn,
  isAuthorized,
  async (req, res) => {
    try {
      const { gameId } = req.params;
      const { items } = req.body;
      const voteGroup = new VoteGroup({ player: req.user._id, items: items });
      await voteGroup.save();

      return res.status(200).json(voteGroup);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

router.put(
  "/:gameId/vote-group/:voteGroupId",
  findGame,
  isLoggedIn,
  isAuthorized,
  async (req, res) => {
    const { voteGroupId } = req.params;
    const game = req.game;

    game.voteGroups.push(voteGroupId);
    await game.save();

    res.status(200).json(game);
  }
);

router.delete("/vote-group/:voteGroupId", isLoggedIn, async (req, res) => {
  const { voteGroupId } = req.params;
  try {
    // First find the vote group to check authorization
    const voteGroup = await VoteGroup.findById(voteGroupId);

    if (!voteGroup) {
      return res.status(404).json({ error: "Vote group not found" });
    }

    // Check if the user owns this vote group
    if (!voteGroup.player.equals(req.user._id)) {
      return res.status(403).json({ error: "Not authorized to delete this vote group" });
    }

    // If authorization passes, delete the vote group
    await VoteGroup.findByIdAndDelete(voteGroupId);
    return res
      .status(200)
      .json({ message: `Deleted VoteGroup with id ${voteGroupId}` });
  } catch (error) {
    return res.status(500).json({ error: "Error deleting VoteGroup" });
  }
});




router.get(
  "/:gameCode",
  sanitizeParams(['gameCode']),
  gameValidators.getGameByCode,
  validate,
  isLoggedIn,
  async (req, res) => {
    const { gameCode } = req.params;
    const game = await Game.findOne({ gameCode })
      .populate("trackGroups")
      .populate("voteGroups");
    if (!game) {
      return res
        .status(404)
        .json({ error: `Game with code '${gameCode}' not found` });
    } else if (!isAuthorizedFunc(game, req.user)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    return res.status(200).json(game);
  }
);

router.get(
  "/info/:gameCode",
  sanitizeParams(['gameCode']),
  gameValidators.getGameByCode,
  validate,
  isLoggedIn,
  async (req, res) => {
    const { gameCode } = req.params;
    const game = await Game.findOne({ gameCode })
    if (!game) {
      return res
        .status(404)
        .json({ error: `Game with code '${gameCode}' not found` });
    }
    return res.status(200).json(game);
  }
);



router.get(
  "/:gameId/create-playlist",
  findGame,
  isLoggedIn,
  isAuthorized,
  async (req, res) => {
    const { gameId } = req.params;
    const game = await Game.findById(gameId).populate([
      {
        path: "voteGroups",
      },
      {
        path: "trackGroups",
      },
    ]);
    const nVotes = game.config.nVotes;

    const voteGroups = game.voteGroups;
    const scoresMap = new Map();
    for (let voteGroup of voteGroups) {
      for (let item of voteGroup.items) {
        const trackId = item.trackId;
        const vote = item.vote;
        const score = nVotes - vote;
        if (scoresMap.has(trackId)) {
          const current = scoresMap.get(trackId);
          scoresMap.set(trackId, current + score);
        } else {
          scoresMap.set(trackId, score);
        }
      }
    }

    for (let trackGroup of game.trackGroups) {
      for (let trackId of trackGroup.trackIds) {
        if (!scoresMap.has(trackId)) {
          scoresMap.set(trackId, 0);
        }
      }
    }

    const shuffledScores = new Map(
      [...scoresMap.entries()].sort(() => Math.random() - 0.5)
    );

    const sortedScores = new Map(
      [...shuffledScores.entries()].sort((a, b) => a[1] - b[1])
    );

    const sortedIds = Array.from(sortedScores.keys());
    const sortedURIs = sortedIds.map((id) => "spotify:track:" + id);

    try {
      // Use the Spotify router's playlist functions
      const playlist = await spotifyRouter.createSpotifyPlaylist(req.user, game.title);
      await spotifyRouter.addTracksToSpotifyPlaylist(req.user, playlist.id, sortedURIs);

      // Update game with playlist ID and mark as completed
      game.playlistId = playlist.id;
      game.status = "completed";
      await game.save();

      res.json(playlist.id);
    } catch (error) {
      console.error("Error creating playlist:", error);
      res.status(500).json({
        error: "Failed to create playlist",
        message: error.message
      });
    }
  }
);

module.exports = router;
