import React from 'react';
import { Box, Typography, Button, Paper, CircularProgress } from '@mui/material';
import CenterBox from '../base/centerBox';

export default function MoveToVoting({
  game,
  userId,
  trackGroups,
  handleMoveToVotingPhase,
  movingToVotingPhase
}) {
  // Only host should access this page
  const isHost = game.host === userId;
  const participantCount = trackGroups?.length || 0;
  const expectedParticipants = game.participants?.length || 0;
  
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
          Session Status
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "12px",
              bgcolor: "rgba(25, 118, 210, 0.05)",
              border: "1px solid",
              borderColor: "rgba(25, 118, 210, 0.2)",
              mb: 3
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              Participant Submissions
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">
                Submitted track lists:
              </Typography>
              <Typography variant="body1" fontWeight="500">
                {participantCount} of {expectedParticipants}
              </Typography>
            </Box>
            
            <Box sx={{ mt: 3, position: 'relative', pt: 0.5 }}>
              <Box 
                sx={{ 
                  height: '8px', 
                  bgcolor: 'background.paper',
                  borderRadius: '4px',
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${(participantCount / Math.max(expectedParticipants, 1)) * 100}%`,
                    bgcolor: 'primary.main',
                    borderRadius: '4px'
                  }}
                />
              </Box>
            </Box>
          </Paper>
          
          <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
            All participants need to submit their track lists before moving to the voting phase.
            {expectedParticipants > 0 && participantCount < expectedParticipants && (
              ` Waiting for ${expectedParticipants - participantCount} more submissions.`
            )}
          </Typography>
          
          {isHost ? (
            <Box textAlign="center">
              <Button
                onClick={handleMoveToVotingPhase}
                variant="contained"
                color="primary"
                size="large"
                disabled={movingToVotingPhase || participantCount === 0}
                sx={{ 
                  borderRadius: "12px", 
                  px: 4, 
                  py: 1.5,
                  minWidth: '200px'
                }}
                startIcon={movingToVotingPhase ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {movingToVotingPhase ? "Processing..." : "Move to Voting Phase"}
              </Button>
              {participantCount === 0 && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  At least one participant must submit tracks before moving to voting
                </Typography>
              )}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
              Only the session host can move the session to the voting phase
            </Typography>
          )}
        </Box>
      </CenterBox>
    </Box>
  );
}