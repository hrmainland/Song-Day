export function votableTracks(game, userId) {

    let trackIds = [];

    for (let trackGroup of game.trackGroups) {
      if (trackGroup.player.toString() !== userId.toString()) {
        trackIds = trackIds.concat(trackGroup.trackIds);
      }
    }
    return trackIds;
}

export function myTrackGroup(game, userId) {
    for (let trackGroup of game.trackGroups) {
        if (trackGroup.player.toString() === userId.toString()) {
          return trackGroup
        }
      }
}

export function myVoteGroup(game, userId) {
    for (let voteGroup of game.voteGroups) {
        if (voteGroup.player.toString() === userId.toString()) {
          return voteGroup
        }
      }
}