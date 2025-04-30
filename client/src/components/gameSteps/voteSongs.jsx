import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Grid, Tabs, Tab } from '@mui/material';
import { DragDropContext } from 'react-beautiful-dnd';
import AddedTracksList from '../trackDisplays/addedTracksList';
import CenterBox from '../base/centerBox';
import { UserContext } from '../../context/userProvider';
import { useGame } from '../../hooks/useGame';
import { votableTracks, myVoteGroup } from '../../../utils/gameUtils';
import { getMultipleTracksById } from '../../../utils/spotifyCalls';
import { usefulTrackComponents } from '../../../utils/spotifyApiUtils';
import { newVoteGroup, addVoteGroupToGame } from '../../../utils/apiCalls';

export default function VoteSongs() {
  const { game, refreshGame } = useGame();
  const { userId, accessToken } = useContext(UserContext);
  
  // VoteSongs state
  const OPTIONS_KEY = `${game?.gameCode}: options`;
  const SHORTLIST_KEY = `${game?.gameCode}: shortlist`;
  const [myVotesSubmitted, setMyVotesSubmitted] = useState(false);
  const [initialIds, setInitialIds] = useState([]);
  const [voteLimit, setVoteLimit] = useState(null);
  const [options, setOptions] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [addView, setAddView] = useState(true);
  
  // Initialize data when component mounts
  useEffect(() => {
    if (!game) return;
    
    // Set vote limit from game config
    setVoteLimit(game.config.nVotes);
    
    // Check if votes are already submitted
    const voteGroup = myVoteGroup(game, userId);
    setMyVotesSubmitted(Boolean(voteGroup));
    
    // Initialize voting options and shortlist
    fetchAndSetIds();
    const sessionShortlist = getSessionShortlist();
    if (sessionShortlist.length === 0) {
      setOptionsFromDb();
    } else {
      setOptions(getSessionOptions());
      setShortlist(sessionShortlist);
    }
  }, [game, userId]);
  
  
  // Fetch track IDs that can be voted on
  const fetchAndSetIds = async () => {
    if (!game) return;
    const trackIds = votableTracks(game, userId);
    setInitialIds(trackIds);
  };
  
  // Load tracks from Spotify and set options
  const setOptionsFromDb = async () => {
    if (!game) return;
    const tracksResponse = votableTracks(game, userId);
    if (tracksResponse.length === 0) {
      setSessionOptions([]);
      setOptions([]);
      return;
    }
    
    const SpotifyTracks = await getMultipleTracksById(
      accessToken,
      tracksResponse
    );
    const trackObjects = SpotifyTracks.map((trackId) => {
      return usefulTrackComponents(trackId);
    });
    setSessionOptions(trackObjects);
    setOptions(trackObjects);
  };
  
  // Local storage utilities
  const getSessionArray = (sessionKey) => {
    let raw = localStorage.getItem(sessionKey);
    try {
      const result = JSON.parse(raw);
      if (!result) {
        return [];
      }
      return result;
    } catch {
      return [];
    }
  };
  
  const setSessionArray = (sessionKey, data) => {
    localStorage.setItem(sessionKey, JSON.stringify(data));
  };
  
  const getSessionOptions = () => getSessionArray(OPTIONS_KEY);
  const getSessionShortlist = () => getSessionArray(SHORTLIST_KEY);
  
  const setSessionOptions = (data) => setSessionArray(OPTIONS_KEY, data);
  const setSessionShortlist = (data) => setSessionArray(SHORTLIST_KEY, data);
  
  // Handle reordering shortlist via drag and drop
  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    // Update local storage
    const sessionShortlist = getSessionShortlist();
    const [updatedSessionShortlist] = sessionShortlist.splice(
      result.source.index,
      1
    );
    sessionShortlist.splice(
      result.destination.index,
      0,
      updatedSessionShortlist
    );
    setSessionShortlist(sessionShortlist);
    
    // Update state
    setShortlist(sessionShortlist);
  };
  
  // Remove track from options
  const removeOption = (index) => {
    // Update local storage
    const sessionOptions = getSessionOptions();
    sessionOptions.splice(index, 1);
    setSessionOptions(sessionOptions);
    
    // Update state
    setOptions(sessionOptions);
  };
  
  // Remove track from shortlist
  const removeShortlist = (index) => {
    // Update local storage
    const sessionShortlist = getSessionShortlist();
    sessionShortlist.splice(index, 1);
    setSessionShortlist(sessionShortlist);
    
    // Update state
    setShortlist(sessionShortlist);
  };
  
  // Move track from options to shortlist
  const addTrackToShortlist = (track, index) => {
    if (voteLimit - getSessionShortlist().length) {
      // Remove track from options
      removeOption(index);
      
      // Add to shortlist in local storage
      const sessionShortlist = getSessionShortlist();
      sessionShortlist.push(track);
      setSessionShortlist(sessionShortlist);
      
      // Update state
      setShortlist(sessionShortlist);
    }
  };
  
  // Move track from shortlist back to options
  const shortlistToOptions = (track, shortlistIndex) => {
    // Remove from shortlist
    removeShortlist(shortlistIndex);
    
    // Determine correct position in options
    var removedCount = 0;
    const sessionShortlist = getSessionShortlist();
    const shortlistSet = new Set(sessionShortlist.map((track) => track.id));
    var optionsIndex;
    for (let i = 0; i < initialIds.length; i++) {
      if (initialIds[i] === track.id) {
        optionsIndex = i - removedCount;
      }
      if (shortlistSet.has(initialIds[i])) removedCount++;
    }
    
    // Add to options in local storage
    const sessionOptions = getSessionOptions();
    sessionOptions.splice(optionsIndex, 0, track);
    setSessionOptions(sessionOptions);
    
    // Update state
    setOptions(sessionOptions);
  };
  
  // Submit votes to server
  const submitVotes = async () => {
    try {
      const sessionShortlist = getSessionShortlist();
      var items = [];
      for (let [index, track] of sessionShortlist.entries()) {
        const item = { trackId: track.id, vote: index };
        items.push(item);
      }
      
      // Create vote group and add to game
      const voteGroup = await newVoteGroup(game._id, items);
      await addVoteGroupToGame(game._id, voteGroup._id);
      
      // Update state
      setMyVotesSubmitted(true);
      
      // Refresh game data
      refreshGame(game.gameCode);
      
      // Clear local storage
      localStorage.removeItem(OPTIONS_KEY);
      localStorage.removeItem(SHORTLIST_KEY);
    } catch (error) {
      console.error("Error submitting votes:", error);
    }
  };
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
                isMissingTracks={voteLimit > getSessionShortlist().length}
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
                  isMissingTracks={voteLimit > getSessionShortlist().length}
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