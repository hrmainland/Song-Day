import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        borderRadius: "16px",
        border: "1px solid rgba(0, 0, 0, 0.2)",
        paddingLeft: "16px",
        paddingRight: "8px",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        height: 50,
        width: "100%",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        },
      }}
    >
      <SearchIcon sx={{ 
        color: "text.secondary", 
        fontSize: "20px", 
        opacity: 0.7,
        mr: 1.5 
      }} />
      <Typography
        sx={{
          color: "inherit",
          fontSize: "0.95rem",
          flexGrow: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          opacity: 0.6,
        }}
      >
        Search for songs to add
      </Typography>
    </Box>
  );
}