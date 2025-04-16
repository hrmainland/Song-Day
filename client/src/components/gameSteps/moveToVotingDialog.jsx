import React, {useContext} from "react";
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
import WarningIcon from "@mui/icons-material/Warning";

import { useGame } from "../../hooks/useGame";
import { moveToVoting } from "../../../utils/apiCalls";

export default function MoveToVotingDialog({
  open,
  onClose,
  onProceed,
  isProcessing,
  participantCount,
  expectedParticipants,
}) {
  const {game} = useGame();
  const notAllSubmitted = expectedParticipants > 0 && participantCount < expectedParticipants;

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
          color: "warning.dark",
        }}
      >
        <ArrowForwardIcon sx={{ mr: 1.5 }} /> Begin Voting
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="body1" paragraph sx={{ fontWeight: 500, mb: 3 }}>
          Moving to the voting phase will:
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
            "Close submissions for all players",
            "Open the voting interface for all players",
            "Allow players to vote on each other's songs"
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
                  bgcolor: "warning.main",
                  mr: 1.5,
                  ml: -2,
                }
              }}
            >
              {item}
            </Typography>
          ))}
        </Box>

        {notAllSubmitted && (
          <Box
            sx={{
              mt: 1,
              mb: 2,
              p: 2.5,
              borderRadius: "10px",
              bgcolor: "rgba(255, 152, 0, 0.08)",
              border: "1px solid rgba(255, 152, 0, 0.2)",
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
            }}
          >
            <WarningIcon 
              sx={{ 
                color: "warning.main",
                mt: 0.5,
              }} 
            />
            <Box>
              <Typography
                variant="subtitle2"
                color="warning.dark"
                fontWeight={600}
                sx={{ mb: 0.5 }}
              >
                Not all players have submitted
              </Typography>
              <Typography
                variant="body2"
                color="warning.dark"
                sx={{ opacity: 0.9 }}
              >
                Waiting for {expectedParticipants - participantCount} more
                player{expectedParticipants - participantCount !== 1 ? "s" : ""} to submit tracks.
                Players who haven't submitted won't be able to add songs once you proceed.
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
          This action cannot be undone. Are you sure you want to proceed?
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
          onClick={() => moveToVoting(game._id)} 
          variant="contained" 
          color="warning"
          disabled={isProcessing || (participantCount === 0)}
          sx={{ 
            borderRadius: "10px",
            px: 4,
            py: 1.2,
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(255, 152, 0, 0.2)",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(255, 152, 0, 0.3)",
            },
            width: "100%",
          }}
          startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
        >
          {isProcessing ? "Processing..." : "Proceed"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}