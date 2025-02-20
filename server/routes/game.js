const bodyParser = require("body-parser");
const express = require("express");
const Game = require("../models/game");
const TrackGroup = require("../models/trackGroup");
const VoteGroup = require("../models/voteGroup");
const router = express.Router();
const generateGameCode = require("../utils/gameCode");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const { MongoClient, ObjectId } = require("mongodb");

router.put("/:gameId/add-me", isLoggedIn, async (req, res) => {
  const { gameId } = req.params;
  const game = await Game.findById(gameId);
  if (!game) {
    res.status(404).json({ message: `No game found with ID ${gameId}` });
    return;
  }
  game.players.push({ user: req.user._id, displayName: "Player x" });
  await game.save();

  res.status(200).json(game);
});

router.delete(
  "/:gameId/remove-player/:userId",
  isLoggedIn,
  async (req, res) => {
    const { gameId, userId } = req.params;
    const game = await Game.findById(gameId);
    if (!game) {
      res.status(404).json({ message: `No game found with ID ${gameId}` });
      return;
    }
    game.players = game.players.filter((player) => !player.user.equals(userId));
    await game.save();
    res.status(200).json(game);
  }
);

router.put(
  "/:gameId/track-group/:trackGroupId",
  isLoggedIn,
  async (req, res) => {
    const { gameId, trackGroupId } = req.params;
    const game = await Game.findById(gameId);
    if (!game) {
      res.status(404).json({ message: `No game found with ID ${gameId}` });
      return;
    }
    game.trackGroups.push(trackGroupId);
    await game.save();

    res.status(200).json(game);
  }
);

router.put("/:gameId/vote-group/:voteGroupId", isLoggedIn, async (req, res) => {
  const { gameId, voteGroupId } = req.params;
  const game = await Game.findById(gameId);
  if (!game) {
    res.status(404).json({ message: `No game found with ID ${gameId}` });
    return;
  }
  game.voteGroups.push(voteGroupId);
  await game.save();

  res.status(200).json(game);
});

router.post("/new", isLoggedIn, async (req, res, next) => {
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
    players: [{ user: userId, displayName: "Host" }],
  };

  const thisGame = new Game(params);
  await thisGame.save();

  res.status(200).json(thisGame);
});

router.post("/:gameId/vote-group", isLoggedIn, async (req, res) => {
  try {
    const { gameId } = req.params;
    const { items } = req.body;
    const voteGroup = new VoteGroup({ player: req.user._id, items: items });
    await voteGroup.save();

    return res.status(200).json(voteGroup);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.delete("/vote-group/:voteGroupId", async (req, res) => {
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

// TODO put this in useEffect and store in cookies
router.get("/:gameCode", async (req, res) => {
  const { gameCode } = req.params;
  const game = await Game.findOne({ gameCode });
  if (game != undefined) {
    res.status(200).json(game);
  } else {
    res.status(404).json({ error: `Game with code '${gameCode}' not found` });
  }
});

router.get("/:gameId/my-track-group", isLoggedIn, async (req, res) => {
  const { gameId } = req.params;
  const game = await Game.findById(gameId).populate("trackGroups", "player");
  if (!game) {
    res.status(404).json({ message: `No game found with ID ${gameId}` });
    return;
  }
  for (let trackGroup of game.trackGroups) {
    if (trackGroup.player.equals(req.user._id)) {
      return res.status(200).json(trackGroup);
    }
  }
  return res.status(200).json(null);
});

router.get("/:gameId/my-vote-group", isLoggedIn, async (req, res) => {
  const { gameId } = req.params;
  const game = await Game.findById(gameId).populate("voteGroups", "player");
  if (!game) {
    res.status(404).json({ message: `No game found with ID ${gameId}` });
    return;
  }
  for (let voteGroup of game.voteGroups) {
    if (voteGroup.player.equals(req.user._id)) {
      return res.status(200).json(voteGroup);
    }
  }
  return res.status(200).json(null);
});

// router.get("/:gameId/all-tracks", async (req, res) => {
//   const { gameId } = req.params;
//   const game = await Game.findById(gameId).populate({
//     path: "trackGroups",
//     populate: {
//       path: "tracks",
//       model: "Track",
//     },
//   });
//   if (!game) {
//     res.status(404).json({ message: `No game found with ID ${gameId}` });
//     return;
//   }
//   let tracks = [];

//   for (let trackGroup of game.trackGroups) {
//     tracks = tracks.concat(trackGroup.tracks);
//   }

//   return res.status(200).json(tracks);
// });

// router.get("/:gameId/votable-tracks", async (req, res) => {
//   const { gameId } = req.params;
//   const game = await Game.findById(gameId).populate({
//     path: "trackGroups",
//     populate: {
//       path: "tracks",
//       model: "Track",
//     },
//   });
//   if (!game) {
//     res.status(404).json({ message: `No game found with ID ${gameId}` });
//     return;
//   }
//   let tracks = [];

//   for (let trackGroup of game.trackGroups) {
//     if (!trackGroup.player._id.equals(req.user._id)) {
//       tracks = tracks.concat(trackGroup.tracks);
//     }
//   }

//   // sort in alphabetical order
//   tracks.sort((a, b) => {
//     const nameA = a.name.toUpperCase();
//     const nameB = b.name.toUpperCase();
//     if (nameA < nameB) {
//       return -1;
//     }
//     if (nameA > nameB) {
//       return 1;
//     }
//     return 0;
//   });


//   return res.status(200).json(tracks);
// });

router.get("/:gameId/votable-tracks", isLoggedIn, async (req, res) => {
  const { gameId } = req.params;
  const game = await Game.findById(gameId).populate({
    path: "trackGroups",
    select: "trackIds player"
  });
  if (!game) {
    res.status(404).json({ message: `No game found with ID ${gameId}` });
    return;
  }

  let trackIds = [];

  for (let trackGroup of game.trackGroups) {
    if (!trackGroup.player.equals(req.user._id)) {
      trackIds = trackIds.concat(trackGroup.trackIds);
    }
  }

  return res.status(200).json(trackIds);
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

router.get("/:gameId/create-playlist", isLoggedIn, async (req, res) => {
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
  console.log('sortedURIs :>> ', sortedURIs);
  res.json(playlistJSON.id);
});

module.exports = router;

