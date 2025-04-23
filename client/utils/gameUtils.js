export const gameStatus = Object.freeze({
  add: "add",
  vote: "vote",
  completed: "completed",
});

export function votableTracks(game, userId) {
  let trackIds = [];

  const myTracks = game.trackGroups.find(
    (trackGroup) => trackGroup.player.toString() === userId.toString()
  )?.trackIds || [];

  for (let trackGroup of game.trackGroups) {
    if (trackGroup.player.toString() !== userId.toString()) {
      trackIds.push(...trackGroup.trackIds);
    }
  }

  // this is to remove tracks that you voted for
  for (let trackId of trackIds) {
    if (myTracks.includes(trackId)) {
      trackIds.splice(trackIds.indexOf(trackId), 1);
    }
  }

  return trackIds;
}

export function myTrackGroup(game, userId) {
  for (let trackGroup of game.trackGroups) {
    if (trackGroup.player.toString() === userId.toString()) {
      return trackGroup;
    }
  }
}

export function myVoteGroup(game, userId) {
  for (let voteGroup of game.voteGroups) {
    if (voteGroup.player.toString() === userId.toString()) {
      return voteGroup;
    }
  }
}
