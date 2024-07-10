export function artistString(artists) {
  var result = "";
  for (let artist of artists) {
    result += artist.name + ", ";
  }
  return result.substring(0, result.length - 2);
}
