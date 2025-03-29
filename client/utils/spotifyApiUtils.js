
export function usefulTrackComponents(track) {
  const artists = artistString(track.artists);
  // TODO add error handling here
  const img = track.album.images[2].url;
  return {
    id: track.id,
    name: track.name,
    artists,
    img,
    album: track.album.name,
    duration_ms: track.duration_ms
  };

}
export function artistString(artists) {
  var result = "";
  for (let artist of artists) {
    result += artist.name + ", ";
  }
  return result.substring(0, result.length - 2);
}


