const bodyParser = require("body-parser");
const express = require("express");
const Game = require("../models/game");
const TrackGroup = require("../models/trackGroup");
const VoteGroup = require("../models/voteGroup");
const router = express.Router();
const generateGameCode = require("../utils/gameCode");
const passport = require("passport");
const { isLoggedIn, findGame, isAuthorized } = require("../middleware");
const { MongoClient, ObjectId } = require("mongodb");

function isAuthorizedFunc(game, user) {
  return game.players.some((entry) => entry.user.equals(user._id));
}

router.put("/:gameId/add-me", findGame, isLoggedIn, async (req, res) => {
  const game = req.game;
  game.players.push({ user: req.user._id, displayName: null });
  await game.save();

  res.status(200).json(game);
});

router.delete(
  "/:gameId/remove-player/:userId",
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
  findGame,
  isLoggedIn,
  isAuthorized,
  async (req, res) => {
    const { trackGroupId } = req.params;
    const game = req.game;
    game.trackGroups.push(trackGroupId);
    await game.save();

    res.status(200).json(game);
  }
);

router.post("/new", isLoggedIn, isAuthorized, async (req, res, next) => {
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
    host: userId,
    players: [{ user: userId, displayName: null }],
  };

  const thisGame = new Game(params);
  await thisGame.save();

  res.status(200).json(thisGame);
});

router.put(
  "/:gameId/display-name",
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

// TODO add authorization here
router.delete("/vote-group/:voteGroupId", isLoggedIn, async (req, res) => {
  const { voteGroupId } = req.params;
  try {
    await VoteGroup.findByIdAndDelete(voteGroupId);
    return res
      .status(200)
      .json({ message: `Deleted VoteGroup with id ${voteGroupId}` });
  } catch (error) {
    return res.status(500).json({ error: "Error deleting VoteGroup" });
  }
});

router.get("/:gameCode", isLoggedIn, async (req, res) => {
  const { gameCode, authRequired } = req.params;
  const game = await Game.findOne({ gameCode })
    .populate("trackGroups")
    .populate("voteGroups");
  if (game === undefined) {
    return res
      .status(404)
      .json({ error: `Game with code '${gameCode}' not found` });
  } else if (authRequired && !isAuthorizedFunc(game, req.user)) {
    return res.status(403).json({ error: "User not authorized" });
  }
  return res.status(200).json(game);
});

const createPlaylist = async (user, playlistName) => {
  const user_id = user.spotify_id;
  const accessToken = user.access_token;
  const playlist = await fetch(
    `https://api.spotify.com/v1/users/${user_id}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playlistName,
        description: "A new playlist created with Spotify API",
        public: true,
      }),
    }
  );
  return playlist;
};

const addTracksToPlaylist = async (user, playlistId, trackURIs) => {
  const accessToken = user.access_token;
  const addTracksResponse = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: trackURIs,
      }),
    }
  );

  if (!addTracksResponse.ok) {
    const addTracksData = await addTracksResponse.json();
    throw new Error(`Error adding tracks: ${addTracksData.error.message}`);
  }
};

router.get(
  "/:gameId/create-playlist",
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

    const playlistData = await createPlaylist(req.user, game.title);
    const playlistJSON = await playlistData.json();
    await addTracksToPlaylist(req.user, playlistJSON.id, sortedURIs);
    res.json(playlistJSON.id);
  }
);

module.exports = router;
