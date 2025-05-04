import React, { useRef, useEffect } from "react";
import {
  Dialog,
  Box,
  TextField,
  IconButton,
  Typography,
  DialogTitle,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AddedTracksList from "./addedTracksList";

const spinAnimation = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

export default function SearchDialog({
  open,
  onClose,
  searchQuery,
  setSearchQuery,
  searching,
  searchResult,
  onAddTrack,
  formatTrack,
  onSearch,
  tracksLimit,
  currentTracksCount,
}) {
  const searchInputRef = useRef(null);

  // Function to focus the search input
  const focusSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Focus the search input when dialog opens
  useEffect(() => {
    if (open) {
      // Use setTimeout to ensure the dialog is fully rendered
      const timeoutId = setTimeout(() => {
        focusSearchInput();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

  return (
    <>
      <style>{spinAnimation}</style>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: { xs: "90%", sm: "1000px" },
            borderRadius: "20px",
            position: "absolute",
            top: { xs: "100px", sm: "127px" },
            maxHeight: "calc(100vh - 150px)",
            overflow: "auto",
            padding: { xs: "16px 0", sm: "20px 0" },
          },
        }}
      >
        <DialogTitle sx={{ 
          px: { xs: 3, sm: 4 },
          pt: { xs: 1, sm: 1 },
          pb: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SearchIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 24 }} />
            <Typography variant="h5" fontWeight={600} sx={{ letterSpacing: '-0.3px' }}>
              Search
            </Typography>
          </Box>
          <IconButton 
            edge="end" 
            onClick={onClose}
            aria-label="close"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <Box sx={{ width: "90%", p: { xs: 1, sm: 2 }, mx: "auto" }}>
          <TextField
            inputRef={searchInputRef}
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for songs"
            variant="outlined"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim().length >= 3) {
                e.preventDefault();
                // Call the parent's search function if provided
                if (onSearch) {
                  onSearch();
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton disabled={searching}>
                  {searching ? (
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          border: "2px solid",
                          borderColor: "grey.300",
                          borderRadius: "50%",
                          borderRightColor: "transparent",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                    </Box>
                  ) : (
                    <SearchIcon />
                  )}
                </IconButton>
              ),
              sx: {
                borderRadius: "16px",
                pr: 1,
              },
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused": {
                  boxShadow: "0 0 0 3px rgba(64,126,160,0.1)",
                },
              },
            }}
          />
        </Box>


        {searchResult &&
        searchResult.tracks &&
        searchResult.tracks.items &&
        searchResult.tracks.items.length > 0 ? (
          <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2 }}>
            <AddedTracksList
              tracks={searchResult.tracks.items.map(track => formatTrack(track))}
              title="Add Tracks"
              isOptions={true}
              addFunc={(track) => onAddTrack(track)}
              isShortlist={true}
              isMissingTracks={!tracksLimit || currentTracksCount < tracksLimit}
              tracksLimit={tracksLimit}
            />
          </Box>
        ) : searching ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">Searching...</Typography>
          </Box>
        ) : searchResult ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              No results found. Try a different search term.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              Search for songs to add to your list
            </Typography>
          </Box>
        )}
      </Dialog>
    </>
  );
}