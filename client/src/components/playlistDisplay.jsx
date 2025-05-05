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
      {/* <Button 
        variant="contained"
        href={`https://open.spotify.com/playlist/${game.playlistId}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ 
          my: 2, 
          mx: 2,
          bgcolor: "#FFFFFF", 
          color: "#000000",
          "&:hover": { bgcolor: "#F8F8F8" },
          fontWeight: 600,
          borderRadius: "24px",
          px: 3,
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
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
      </Button> */}
      <Button
        variant="contained"
        onClick={() => {
          const uri = `spotify:playlist:${game.playlistId}`;
          const fallbackUrl = `https://open.spotify.com/playlist/${game.playlistId}`;

          // Try to open in app
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.src = uri;
          document.body.appendChild(iframe);


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
