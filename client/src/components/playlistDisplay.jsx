import React, { useContext } from "react";
import { Box, Typography, Button } from "@mui/material";
import CenterBox from "./base/centerBox";
import { useGame } from "../hooks/useGame";

export default function PlaylistDisplay({}) {
  const { game } = useGame();

  if (game.playlistId === null)
    return (
      <CenterBox maxWidth="1000px">
        <Typography variant="h4" sx={{ mt: 4, mx: 2 }}>
          Something's gone wrong
        </Typography>
        <Typography gutterTop variant="body1" sx={{ my: 2, mx: 2 }}>
          Unfortunately we were unable to show a preview of your playlist
        </Typography>
      </CenterBox>
    );

  return (
    <CenterBox maxWidth="1000px">
      <Typography variant="h4" sx={{ mt: 4, mx: 2 }}>
        Here's your playlist!
      </Typography>
      <Typography gutterTop variant="body1" sx={{ my: 2, mx: 2 }}>
        It's been saved to your Spotify library
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          // Check device type
          const userAgent = navigator.userAgent;
          const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
          const isAndroid = /android/i.test(userAgent);
          const isMobile = isIOS || isAndroid || /Mobi|Android/i.test(userAgent);

          const playlistId = game.playlistId;
          const fallbackUrl = `https://open.spotify.com/playlist/${playlistId}`;
          
          // Different handling based on device
          if (isIOS) {
            // iOS requires different handling - direct link often works better than iframe
            window.location.href = `spotify:playlist:${playlistId}`;
            
            // Fallback timer for iOS - direct to App Store
            const iosTimeout = setTimeout(() => {
              window.location.href = "https://apps.apple.com/app/spotify-music/id324684580";
            }, 1500);
            
            // No need to clear on IOS
            
          } else if (isAndroid) {
            // Android deep linking
            window.location.href = `spotify:playlist:${playlistId}`;

            
            // Fallback for Android
            const androidTimeout = setTimeout(() => {
              window.location.href = `https://play.google.com/store/apps/details?id=com.spotify.music`;
            }, 1500);
            
            // Clear the timeout if the page is left before timeout completes
            window.addEventListener("blur", () => {
              clearTimeout(androidTimeout);
            }, { once: true });

          } else {
            // Desktop browser - try URI first with iframe
            const iframe = document.createElement("iframe");
            iframe.style.display = "none";
            iframe.src = `spotify:playlist:${playlistId}`;
            document.body.appendChild(iframe);
            

            const timeout = setTimeout(() => {
                window.open(fallbackUrl, "_blank");
            }, 1500);
  
            // Clear the timeout if the page is left before timeout completes
            window.addEventListener("blur", () => {
              clearTimeout(timeout);
            }, { once: true });
          }
        }}
        sx={{
          my: 2,
          mx: 2,
          bgcolor: "#FFFFFF",
          color: "#000000",
          "&:hover": { bgcolor: "#F8F8F8" },
          fontWeight: 600,
          borderRadius: "24px",
          px: 3,
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
        startIcon={
          <Box
            component="img"
            src="/Spotify_Icon.svg"
            alt="Spotify icon"
            sx={{ height: 24, width: 24 }}
          />
        }
      >
        LISTEN ON SPOTIFY
      </Button>

      <Box sx={{ mt: 3, mx: 2 }}>
        <iframe
          style={{ borderRadius: "12px" }}
          src={`https://open.spotify.com/embed/playlist/${game.playlistId}?utm_source=generator`}
          width="100%"
          height="352"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </Box>
    </CenterBox>
  );
}
