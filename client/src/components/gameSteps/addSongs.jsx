import React from 'react';
import { Box, Typography } from '@mui/material';
import AddedTracksList from '../trackDisplays/addedTracksList';
import EmptyTracksView from '../trackDisplays/emptyTracksView';
import SearchBar from '../trackDisplays/searchBar';
import SearchDialog from '../trackDisplays/searchDialog';
import CenterBox from '../base/centerBox';
import SubmittedView from '../trackDisplays/submittedView';

export default function AddSongs({
  myTracksSubmitted,
  addedTracks,
  trackLimit,
  handleSearchOpen,
  searchOpen,
  searchQuery,
  setSearchQuery,
  searching,
  searchResult,
  removeTrackFromSession,
  handleSearchClose,
  formatTrack,
  addTrack,
  handleSearch
}) {
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
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            mb: 2,
            gap: 2
          }}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight="500"
              sx={{ letterSpacing: "-0.3px", mb: 0.5 }}
            >
              Your List ({addedTracks.length}/{trackLimit})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {trackLimit - addedTracks.length} more track{trackLimit - addedTracks.length === 1 ? '' : 's'} needed
            </Typography>
          </Box>
          
          <Box sx={{ 
            maxWidth: { xs: '100%', sm: '60%', md: '50%' } 
          }}>
            <SearchBar onClick={handleSearchOpen} />
          </Box>
        </Box>

        {addedTracks.length > 0 ? (
          <AddedTracksList 
            tracks={addedTracks} 
            onRemoveTrack={removeTrackFromSession} 
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
      />
    </Box>
  );
}