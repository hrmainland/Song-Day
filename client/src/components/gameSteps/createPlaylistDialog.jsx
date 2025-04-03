import React from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function CreatePlaylistDialog({
  open,
  onClose,
  onProceed,
  isProcessing,
  participantCount,
  expectedParticipants,
}) {
  const notAllVoted = expectedParticipants > 0 && participantCount < expectedParticipants;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          p: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "success.dark",
        }}
      >
        <PlaylistAddCheckIcon sx={{ mr: 1.5 }} /> Create Playlist
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="body1" paragraph sx={{ fontWeight: 500, mb: 3 }}>
          Creating the playlist will:
        </Typography>

        <Box 
          component="ul" 
          sx={{ 
            pl: 2, 
            mt: 0,
            listStyleType: "none",
            mb: 3,
          }}
        >
          {[
            "Create a new Spotify playlist on your account",
            "Add all the top-voted songs to the playlist",
            "Let you share the playlist with all participants"
          ].map((item, index) => (
            <Typography 
              key={index}
              component="li" 
              variant="body1" 
              sx={{ 
                mb: 1.5,
                display: "flex",
                alignItems: "center",
                "&::before": {
                  content: '""',
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  bgcolor: "success.main",
                  mr: 1.5,
                  ml: -2,
                }
              }}
            >
              {item}
            </Typography>
          ))}
        </Box>

        {notAllVoted && (
          <Box
            sx={{
              mt: 1,
              mb: 2,
              p: 2.5,
              borderRadius: "10px",
              bgcolor: "rgba(76, 175, 80, 0.08)",
              border: "1px solid rgba(76, 175, 80, 0.2)",
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
            }}
          >
            <CheckCircleIcon 
              sx={{ 
                color: "success.main",
                mt: 0.5,
              }} 
            />
            <Box>
              <Typography
                variant="subtitle2"
                color="success.dark"
                fontWeight={600}
                sx={{ mb: 0.5 }}
              >
                Not all players have voted
              </Typography>
              <Typography
                variant="body2"
                color="success.dark"
                sx={{ opacity: 0.9 }}
              >
                Waiting for {expectedParticipants - participantCount} more
                player{expectedParticipants - participantCount !== 1 ? "s" : ""} to vote.
                You can still create the playlist now with current votes.
              </Typography>
            </Box>
          </Box>
        )}
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: "text.secondary",
            fontStyle: "italic",
            mt: 4,
          }}
        >
          Ready to create your playlist?
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="inherit"
          disabled={isProcessing}
          sx={{ 
            borderRadius: "10px",
            px: 3.8,
            py: 1,
            fontWeight: 500,
            width: "100%",
          }}
        >
          Back
        </Button>
        
        <Button 
          onClick={onProceed} 
          variant="contained" 
          color="success"
          disabled={isProcessing || (participantCount === 0)}
          sx={{ 
            borderRadius: "10px",
            px: 4,
            py: 1.2,
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(76, 175, 80, 0.3)",
            },
            width: "100%",
          }}
          startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <PlaylistAddCheckIcon />}
        >
          {isProcessing ? "Processing..." : "Create Playlist"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}