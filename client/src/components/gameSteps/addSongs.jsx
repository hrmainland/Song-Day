import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography } from '@mui/material';
import AddedTracksList from '../trackDisplays/addedTracksList';
import EmptyTracksView from '../trackDisplays/emptyTracksView';
import SearchBar from '../trackDisplays/searchBar';
import SearchDialog from '../trackDisplays/searchDialog';
import CenterBox from '../base/centerBox';
import SubmittedView from '../trackDisplays/submittedView';
import { UserContext } from '../../context/userProvider';
import { useGame } from '../../hooks/useGame';
// import { searchTracks } from '../../../utils/spotifyCalls';
import { searchTracks } from '../../../utils/spotifyApiCalls';

import { artistString } from '../../../utils/spotifyApiUtils';
import { addSessionTracks, addTrackGroupToGame } from '../../../utils/apiCalls';
import { myTrackGroup } from '../../../utils/gameUtils';

export default function AddSongs() {
  const { game, refreshGame } = useGame();
  const { userId } = useContext(UserContext);
  
  // AddSongs state
  const TRACK_KEY = `${game?.gameCode}: tracks`;
  const [myTracksSubmitted, setMyTracksSubmitted] = useState(false);
  const [trackLimit, setTrackLimit] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [addedTracks, setAddedTracks] = useState([]);
  

  useEffect(() => {
    if (!game) return;
    
    // Update track limit from game config
    setTrackLimit(game.config.nSongs);
    
    // Check if tracks are already submitted
    const trackGroup = myTrackGroup(game, userId);
    const isTracksSubmitted = Boolean(trackGroup);
    setMyTracksSubmitted(isTracksSubmitted);
    
    // Load tracks from local storage
    const storedTracks = getSessionTracks();
    setAddedTracks(storedTracks);
  }, [game, userId]);

  // Search dialog handlers
  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchResult(null);
    setSearchQuery("");
  };

  // Get tracks from local storage
  const getSessionTracks = () => {
    let tracks = localStorage.getItem(TRACK_KEY);
    try {
      const result = JSON.parse(tracks);
      if (!result) {
        return [];
      }
      return result;
    } catch {
      return [];
    }
  };

  // Check for duplicate tracks
  const checkForDuplicate = (newTrack, tracks) => {
    const ids = tracks.map((track) => track.id);
    return ids.includes(newTrack.id);
  };

  // Add track to session
  const addTrackToSession = (track) => {
    const tracks = getSessionTracks();
    const isDuplicate = checkForDuplicate(track, tracks);
    if (!isDuplicate) {
      tracks.push(track);
      localStorage.setItem(TRACK_KEY, JSON.stringify(tracks));
      setAddedTracks(tracks);
    }
  };

  // Remove track from session
  const removeTrackFromSession = (track) => {
    let tracks = getSessionTracks();
    tracks = tracks.filter((song) => song.id !== track.id);
    localStorage.setItem(TRACK_KEY, JSON.stringify(tracks));
    setAddedTracks(tracks);
  };

  // Format track from Spotify API response
  const formatTrack = (track) => {
    const artists = artistString(track.artists);
    const img =
      track.album.images.length > 0 ? track.album.images[2]?.url : null;
    return {
      id: track.id,
      name: track.name,
      artists,
      img,
      album: track.album.name,
      duration_ms: track.duration_ms,
    };
  };

  // Search for tracks
  const performSearch = async (query) => {
    if (!query || query.trim().length < 1) {
      setSearchResult(null);
      return;
    }

    try {
      setSearching(true);
      const result = await searchTracks(query);

      // Filter out tracks that are already added
      const currentTracks = getSessionTracks();
      const currentTrackIds = new Set(currentTracks.map((track) => track.id));

      if (result && result.tracks && result.tracks.items) {
        result.tracks.items = result.tracks.items.filter(
          (track) => !currentTrackIds.has(track.id)
        );
      }

      setSearchResult(result);
    } catch (error) {
      console.error("Error searching tracks:", error);
    } finally {
      setSearching(false);
    }
  };

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim().length >= 1) {
      performSearch(searchQuery);
    }
  };

  // Handle search input change with debounce
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchOpen && searchQuery.trim().length >= 3) {
        performSearch(searchQuery);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, searchOpen]);

  // Add track to user's list
  const addTrack = (track) => {
    if (trackLimit && addedTracks.length >= trackLimit) {
      return;
    }

    addTrackToSession(track);

    // Remove track from search results to avoid duplicates
    if (searchResult && searchResult.tracks && searchResult.tracks.items) {
      const updatedItems = searchResult.tracks.items.filter(
        (item) => item.id !== track.id
      );
      setSearchResult({
        ...searchResult,
        tracks: {
          ...searchResult.tracks,
          items: updatedItems,
        },
      });
    }
  };

  // Submit tracks to session
  const submitTracks = async () => {
    try {
      const storedTracks = getSessionTracks();

      if (storedTracks.length < trackLimit) {
        return;
      }

      const trackGroup = await addSessionTracks(storedTracks);
      await addTrackGroupToGame(game._id, trackGroup._id);

      // Clear local storage
      localStorage.removeItem(TRACK_KEY);

      // Update state
      setMyTracksSubmitted(true);
      
      // Refresh game data
      refreshGame(game.gameCode);
    } catch (error) {
      console.error("Error submitting tracks:", error);
    }
  };

  if (myTracksSubmitted) {
    return <SubmittedView />;
  }

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
        <Box
          sx={{ 
            mb: 2,
            pr: 3,
          }}
        >
          <Box sx={{ 
            maxWidth: "100%"
          }}>
            <SearchBar onClick={handleSearchOpen} />
          </Box>
        </Box>

        {addedTracks.length > 0 ? (
          <AddedTracksList
            tracks={addedTracks} 
            title={`Your List (${addedTracks.length}/${trackLimit})`}
            onRemoveTrack={removeTrackFromSession} 
            submitFunc={submitTracks}
            isMissingTracks={trackLimit > addedTracks.length}
          />
        ) : (
          <EmptyTracksView />
        )}
      </CenterBox>
      
      {/* Search Dialog */}
      <SearchDialog
        open={searchOpen}
        onClose={handleSearchClose}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searching={searching}
        searchResult={searchResult}
        onAddTrack={addTrack}
        formatTrack={formatTrack}
        onSearch={handleSearch}
        tracksLimit={trackLimit}
        currentTracksCount={addedTracks.length}
      />
    </Box>
  );
}