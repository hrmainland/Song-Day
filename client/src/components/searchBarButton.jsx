import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBarButton({ onClick, disabled = false }) {
  return (
    <Box
      onClick={!disabled ? onClick : undefined}
      sx={{
        borderRadius: "20px",
        border: "1px solid rgba(0, 0, 0, 0.2)",
        paddingLeft: "20px",
        paddingRight: "10px",
        display: "flex",
        alignItems: "center",
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        cursor: disabled ? 'default' : 'pointer',
        height: 40,
      }}
    >
      <Typography
        sx={{
          color: "inherit",
          fontSize: "1rem",
          flexGrow: 1,
          lineHeight: '40px',
          opacity: 0.4,
        }}
      >
        Search
      </Typography>
      <IconButton disabled={disabled} sx={{ p: "6px" }}>
        <SearchIcon />
      </IconButton>
    </Box>
  );
}

