import React, {useContext} from "react";
import {
  Paper,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
} from "@mui/material";
import { useGame } from "../hooks/useGame";
import { UserContext } from "../context/userProvider";
import { Link } from "react-router-dom";

// Define steps - Move to Voting and Create Playlist only shown to host
const getSteps = (isHost) => {
  const baseSteps = ['Add Songs'];
  const hostOnlySteps = ['Open Voting'];
  const commonNextSteps = ['Vote'];
  const finalSteps = ['Create Playlist'];
  
  if (isHost) {
    return [...baseSteps, ...hostOnlySteps, ...commonNextSteps, ...finalSteps];
  } else {
    return [...baseSteps, ...commonNextSteps];
  }
};



export default function GameStepper({
  activeStep,
  handleBack,
  handleNext,
  submitTracks,
  submitVotes,
  addedTracks,
  trackLimit,
  myTracksSubmitted,
  getSessionShortlist,
  voteLimit,
  myVotesSubmitted,
  addView,
}) {
  const { userId, setUserId } = useContext(UserContext);
  const { game, refreshGame, loading, gameError } = useGame();
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: { xs: 2, sm: 2.5 }, 
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        border: '1px solid rgba(64,126,160,0.1)',
      }}
    >
      {/* Stepper Component */}
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {getSteps(game.host === userId).map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {/* Navigation description */}
      <Typography 
        variant="body1" 
        color="text.secondary" 
        textAlign="center" 
        sx={{ mb: 3 }}
      >
        {activeStep === 0 && !myTracksSubmitted && (
          `Add ${trackLimit} songs to your list, then submit them to continue.`
        )}
        {activeStep === 0 && myTracksSubmitted && (
          "You've already submitted your songs. Continue to the next step."
        )}
        {/* Host-only move to voting step */}
        {activeStep === 1 && game.host === userId && (
          "As the host, you can move the session to the voting phase once all participants have submitted their tracks."
        )}
        {/* Voting step - shifted to step 1 for non-hosts and step 2 for hosts */}
        {(activeStep === 1 && game.host !== userId && !myVotesSubmitted) || 
         (activeStep === 2 && game.host === userId && !myVotesSubmitted) && (
          `Select ${voteLimit} songs from the options and rank them in order of preference.`
        )}
        {(activeStep === 1 && game.host !== userId && myVotesSubmitted) || 
         (activeStep === 2 && game.host === userId && myVotesSubmitted) && (
          "You've already submitted your votes. Continue to see the playlist."
        )}
        {/* Create playlist step - shifted to step 3 for hosts */}
        {activeStep === 3 && game.host === userId && (
          "Create a Spotify playlist with the top-voted songs."
        )}
      </Typography>
      
      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
          sx={{ 
            mr: 1, 
            borderRadius: '12px',
            px: 3,
            py: 1.2
          }}
        >
          Back
        </Button>
        
        {activeStep === 0 && !myTracksSubmitted && (
          <Button
            variant="contained"
            color="primary"
            onClick={submitTracks}
            disabled={addedTracks.length < trackLimit}
            sx={{ 
              borderRadius: '12px',
              px: 3,
              py: 1.2
            }}
          >
            Submit Tracks
          </Button>
        )}
        
        {/* Vote submission button - adjusted for new step indexing */}
        {((activeStep === 1 && !myVotesSubmitted && !addView && game.host !== userId) ||
          (activeStep === 2 && !myVotesSubmitted && !addView && game.host === userId)) && (
          <Button
            variant="contained"
            color="primary"
            onClick={submitVotes}
            disabled={getSessionShortlist().length < voteLimit}
            sx={{ 
              borderRadius: '12px',
              px: 3,
              py: 1.2
            }}
          >
            Submit Votes
          </Button>
        )}
        
        {/* Host-only MoveToVoting button */}
        {activeStep === 1 && game.host === userId && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            sx={{ 
              borderRadius: '12px',
              px: 3,
              py: 1.2
            }}
          >
            Open Voting
          </Button>
        )}
        
        {/* Next button only shown when appropriate for current step */}
        {((activeStep === 0 && myTracksSubmitted) || 
          (activeStep === 2 && myVotesSubmitted && game.host === userId) ||
          (activeStep === 1 && myVotesSubmitted && game.host !== userId) ||
          ((activeStep === 1 && game.host !== userId) || 
           (activeStep === 2 && game.host === userId)) && addView) && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            sx={{ 
              borderRadius: '12px',
              px: 3,
              py: 1.2
            }}
          >
            Next
          </Button>
        )}
      </Box>
    </Paper>
  );
}