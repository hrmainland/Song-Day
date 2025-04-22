import React, {useContext} from "react";
import { Box, Typography } from "@mui/material";
import CenterBox from "./base/centerBox";
import { useGame } from "../hooks/useGame";

export default function PlaylistDisplay({}) {
  const { game } = useGame();

  if (game.playlistId === null) return (
    <CenterBox maxWidth="1000px">
    <Typography variant="h4" sx={{ mt: 4, mx: 2 }}>
      Something's gone wrong
    </Typography>
    <Typography gutterTop variant="body1" sx={{ my: 2, mx:2}}>
      Unfortunately we were unable to show a preview of your playlist
    </Typography>
  </CenterBox>
  );

  return (
    <CenterBox maxWidth="1000px">
      <Typography variant="h4" sx={{ mt: 4, mx: 2 }}>
        Here's your playlist
      </Typography>
      <Typography gutterTop variant="body1" sx={{ my: 2, mx:2}}>
        It's been saved to your Spotify library
      </Typography>
      <Box sx={{ mt: 3, mx: 2  }}>
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
