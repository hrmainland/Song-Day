const APPLE_APP_STORE_URL = "https://apps.apple.com/app/spotify-music/id324684580";
const GOOGLE_PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.spotify.music";

export function openSpotify(isTrack, assetId) {
  // Check device type
  const userAgent = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const isAndroid = /android/i.test(userAgent);
  const isMobile = isIOS || isAndroid || /Mobi|Android/i.test(userAgent);

  const fallbackUrl = isTrack ? `https://open.spotify.com/track/${assetId}` : `https://open.spotify.com/playlist/${assetId}`;
  const uri = isTrack ? `spotify:track:${assetId}` : `spotify:playlist:${assetId}`;

  // Different handling based on device
  if (isIOS) {
    // iOS requires different handling - direct link often works better than iframe
    window.location.href = uri;
    
    // Fallback timer for iOS - direct to App Store
    const iosTimeout = setTimeout(() => {
      window.location.href = APPLE_APP_STORE_URL;
    }, 1500);
    
    // No need to clear on IOS
    
  } else if (isAndroid) {
    // Android deep linking
    window.location.href = uri;

    
    // Fallback for Android
    const androidTimeout = setTimeout(() => {
      window.location.href = GOOGLE_PLAY_STORE_URL;
    }, 1500);
    
    // Clear the timeout if the page is left before timeout completes
    window.addEventListener("blur", () => {
      clearTimeout(androidTimeout);
    }, { once: true });

  } else {
    // Desktop browser - try URI first with iframe
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = uri;
    document.body.appendChild(iframe);
    

    const timeout = setTimeout(() => {
        window.open(fallbackUrl, "_blank");
    }, 1500);

    // Clear the timeout if the page is left before timeout completes
    window.addEventListener("blur", () => {
      clearTimeout(timeout);
    }, { once: true });
  }
}


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


