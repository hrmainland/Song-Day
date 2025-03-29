import React from "react";
import { Box, Typography } from "@mui/material";

export default function EmptyTracksView() {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center"
      sx={{ 
        pt: 5, 
        px: 3,
        textAlign: 'center', 
        maxWidth: '700px',
        mx: 'auto'
      }}
    >
      <Box sx={{ maxWidth: 260, mb: 3 }}>
        <img src="/sailboat.svg" alt="Sailboat" style={{ width: '100%', height: 'auto' }} />
      </Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Your songs go here
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
        Use the search bar above to find them.
      </Typography>
    </Box>
  );
}