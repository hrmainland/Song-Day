import React, { useRef, useEffect } from "react";
import {
  Dialog,
  Box,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  Grid,
  Avatar,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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
            padding: { xs: 2, sm: 4 },
            position: "absolute",
            top: { xs: "100px", sm: "127px" },
            maxHeight: "calc(100vh - 150px)",
            overflow: "auto",
          },
        }}
      >
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

        <Box sx={{ width: "100%", height: "1px", bgcolor: "divider", mb: 3 }} />

        {searchResult &&
        searchResult.tracks &&
        searchResult.tracks.items &&
        searchResult.tracks.items.length > 0 ? (
          <List sx={{ width: "100%" }}>
            {searchResult.tracks.items.map((track) => {
              const formattedTrack = formatTrack(track);
              return (
                <ListItem
                  key={track.id}
                  sx={{
                    py: 1.5,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.04)",
                    },
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
                  onClick={() => onAddTrack(formattedTrack)}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={2} sm={1}>
                      <Avatar
                        variant="square"
                        src={formattedTrack.img}
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: "4px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                    </Grid>
                    <Grid item xs={10} sm={11}>
                      <ListItemText
                        primary={formattedTrack.name}
                        secondary={`${formattedTrack.artists} • ${formattedTrack.album}`}
                        primaryTypographyProps={{
                          variant: "body1",
                          sx: {
                            fontSize: 16,
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                        }}
                        secondaryTypographyProps={{
                          variant: "body2",
                          sx: {
                            color: "text.secondary",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
              );
            })}
          </List>
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