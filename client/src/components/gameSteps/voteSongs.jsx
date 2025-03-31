import React from 'react';
import { Box, Typography, Grid, Tabs, Tab } from '@mui/material';
import { DragDropContext } from 'react-beautiful-dnd';
import AddedTracksList from '../trackDisplays/addedTracksList';
import CenterBox from '../base/centerBox';

export default function VoteSongs({
  myVotesSubmitted,
  addView,
  setAddView,
  getSessionOptions,
  addTrackToShortlist,
  getSessionShortlist,
  shortlistToOptions,
  submitVotes,
  voteLimit,
  onDragEnd
}) {
  if (myVotesSubmitted) {
    return (
      <CenterBox
        maxWidth="1000px"
        p={{ xs: 2, sm: 2.5 }}
        sx={{
          mt: 1.5,
          mb: 3,
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h5" textAlign="center" sx={{ mb: 2 }}>
          You've already submitted your votes
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary">
          Your votes have been recorded. Check back later to see the final playlist.
        </Typography>
      </CenterBox>
    );
  }

  return (
    <Box sx={{ mt: 1.5, mb: 3 }}>
      <CenterBox
        maxWidth="1200px"
        p={{ xs: 2, sm: 2.5 }}
        sx={{
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        {/* Mobile View Selector Tabs */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, width: '100%', mb: 2 }}>
          <Tabs 
            value={addView ? 0 : 1} 
            onChange={(e, newValue) => setAddView(newValue === 0)}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': {
                fontWeight: 600,
                py: 1.5
              } 
            }}
          >
            <Tab label="Options" sx={{ fontSize: 18 }} />
            <Tab label={`Shortlist (${getSessionShortlist().length})`} sx={{ fontSize: 18 }} />
          </Tabs>
        </Box>

        {/* Mobile View Content */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Box
            display="flex"
            justifyContent="center"
            sx={{
              display: addView ? "flex" : "none",
              width: "100%"
            }}
          >
            <AddedTracksList
              tracks={getSessionOptions()}
              onRemoveTrack={() => {}}
              title="Your Options"
              isOptions={true}
              addFunc={addTrackToShortlist}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            sx={{
              display: addView ? "none" : "flex",
              width: "100%"
            }}
          >
            <DragDropContext onDragEnd={onDragEnd}>
              <AddedTracksList
                tracks={getSessionShortlist()}
                onRemoveTrack={shortlistToOptions}
                title="Your Shortlist"
                isShortlist={true}
                submitFunc={submitVotes}
                missingTracks={voteLimit - getSessionShortlist().length}
                isDraggable={true}
              />
            </DragDropContext>
          </Box>
        </Box>

        {/* Desktop Side-by-Side View */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, width: "100%" }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Grid container spacing={3}>
              <Grid item md={6}>
                <AddedTracksList
                  tracks={getSessionOptions()}
                  onRemoveTrack={() => {}}
                  title="Your Options"
                  isOptions={true}
                  addFunc={addTrackToShortlist}
                />
              </Grid>
              <Grid item md={6}>
                <AddedTracksList
                  tracks={getSessionShortlist()}
                  onRemoveTrack={shortlistToOptions}
                  title="Your Shortlist"
                  isShortlist={true}
                  submitFunc={submitVotes}
                  missingTracks={voteLimit - getSessionShortlist().length}
                  isDraggable={true}
                />
              </Grid>
            </Grid>
          </DragDropContext>
        </Box>
      </CenterBox>
    </Box>
  );
}