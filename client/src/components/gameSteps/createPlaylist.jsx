import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import CenterBox from '../base/centerBox';

export default function CreatePlaylist({
  game,
  userId,
  playlistId,
  handleCreatePlaylist
}) {
  return (
    <Box sx={{ mt: 1.5, mb: 3 }}>
      <CenterBox
        maxWidth="1000px"
        p={{ xs: 2, sm: 2.5 }}
        sx={{
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h5" fontWeight="500" sx={{ mb: 3, textAlign: "center" }}>
          Create Playlist
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
          There are {game.voteGroups?.length || 0} sets of votes submitted
        </Typography>
        
        {!playlistId ? (
          <Box display="flex" justifyContent="center">
            <Button 
              onClick={handleCreatePlaylist}
              variant="contained"
              color="secondary"
              size="large"
              sx={{ borderRadius: "12px", px: 4, py: 1.2 }}
              disabled={!game.host || game.host !== userId}
            >
              Create Playlist
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 3 }}>
            <iframe
              style={{ borderRadius: "12px" }}
              src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
              width="100%"
              height="352"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </Box>
        )}
        
        {game.host !== userId && (
          <Typography variant="body2" sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}>
            Only the session host can create the playlist
          </Typography>
        )}
      </CenterBox>
    </Box>
  );
}