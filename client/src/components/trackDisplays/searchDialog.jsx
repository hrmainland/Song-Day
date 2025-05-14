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
        fullScreen
        sx={{
          '& .MuiDialog-container': {
            alignItems: { xs: 'flex-start', sm: 'center' }
          }
        }}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "90%", md: "1000px" },
            borderRadius: { xs: "0", sm: "20px" },
            position: "absolute",
            height: { xs: "100vh", sm: "auto" },
            top: { xs: "0", sm: "100px", md: "127px" },
            maxHeight: { xs: "100vh", sm: "calc(100vh - 150px)" },
            overflow: "auto", // Allow scrolling on the dialog paper
            padding: { xs: "0", sm: "20px 0" }, // Remove padding on xs
            margin: 0,
            display: "flex",
            flexDirection: "column"
          },
        }}
      >
        <DialogTitle sx={{ 
          px: { xs: 3, sm: 4 },
          pt: { xs: 2, sm: 1 },
          pb: { xs: 1, sm: 0 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          zIndex: 10,
          borderBottom: { xs: '1px solid rgba(0,0,0,0.08)', sm: 'none' }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SearchIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: { xs: 28, sm: 24 } }} />
            <Typography 
              variant="h5" 
              fontWeight={600} 
              sx={{ 
                letterSpacing: '-0.3px',
                fontSize: { xs: '1.3rem', sm: '1.5rem' }
              }}
            >
              Search
            </Typography>
          </Box>
          <IconButton 
            edge="end" 
            onClick={onClose}
            aria-label="close"
            sx={{ 
              color: 'text.secondary',
              padding: { xs: '12px', sm: '8px' }
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.25rem' } }} />
          </IconButton>
        </DialogTitle>
        
        <Box sx={{ 
          width: { xs: "95%", sm: "90%" }, 
          p: { xs: "0 0 8px 0", sm: 2 }, 
          mx: "auto",
          mt: { xs: 1, sm: 0 }
        }}>
          <TextField
            inputRef={searchInputRef}
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for songs"
            variant="outlined"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim().length >= 1) {
                e.preventDefault();
                // Call the parent's search function if provided
                if (onSearch) {
                  onSearch();
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <IconButton 
                  disabled={searching}
                  sx={{ 
                    padding: { xs: '10px', sm: '8px' } 
                  }}
                  onClick={() => {
                    if (searchQuery.trim().length >= 3 && onSearch) {
                      onSearch();
                    }
                  }}
                >
                  {searching ? (
                    <Box
                      sx={{
                        width: { xs: 28, sm: 24 },
                        height: { xs: 28, sm: 24 },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 18, sm: 16 },
                          height: { xs: 18, sm: 16 },
                          border: "2px solid",
                          borderColor: "grey.300",
                          borderRadius: "50%",
                          borderRightColor: "transparent",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                    </Box>
                  ) : (
                    <SearchIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.25rem' } }} />
                  )}
                </IconButton>
              ),
              sx: {
                borderRadius: { xs: "8px", sm: "16px" },
                pr: 1,
                height: { xs: '48px', sm: 'auto' }
              },
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused": {
                  boxShadow: "0 0 0 3px rgba(64,126,160,0.1)",
                },
              },
              "& .MuiInputBase-input": {
                fontSize: { xs: '1rem', sm: '0.875rem' }
              }
            }}
          />
        </Box>


        {searchResult &&
        searchResult.tracks &&
        searchResult.tracks.items &&
        searchResult.tracks.items.length > 0 ? (
          <Box sx={{ 
            px: { xs: 1, sm: 3 }, 
            pt: { xs: 1, sm: 2 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
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
          <Box sx={{ 
            p: 4, 
            textAlign: "center",
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: { xs: 'calc(100vh - 140px)', sm: 'auto' },
            overflow: 'auto'
          }}>
            <Typography color="text.secondary" variant="body1">Searching...</Typography>
          </Box>
        ) : searchResult ? (
          <Box sx={{ 
            p: 4, 
            textAlign: "center",
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: { xs: 'calc(100vh - 140px)', sm: 'auto' },
            overflow: 'auto'
          }}>
            <Typography color="text.secondary" variant="body1">
              No results found. Try a different search term.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            p: 4, 
            textAlign: "center",
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: { xs: 'calc(100vh - 140px)', sm: 'auto' },
            overflow: 'auto'
          }}>
            <Typography color="text.secondary" variant="body1">
              Search for songs to add to your list
            </Typography>
          </Box>
        )}
      </Dialog>
    </>
  );
}