import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        borderRadius: "20px",
        border: "1px solid rgba(0, 0, 0, 0.2)",
        paddingLeft: "20px",
        paddingRight: "10px",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        height: 42,
        width: "100%",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        },
      }}
    >
      <Typography
        sx={{
          color: "inherit",
          fontSize: "1rem",
          flexGrow: 1,
          lineHeight: "40px",
          opacity: 0.4,
        }}
      >
        Search for songs to add
      </Typography>
      <IconButton sx={{ p: "6px" }}>
        <SearchIcon />
      </IconButton>
    </Box>
  );
}