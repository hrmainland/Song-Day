import React from 'react';
import { Box, Grid } from '@mui/material';

export default function SessionsContainer({ children, borderColor = 'rgba(93,74,156,0.1)' }) {
  return (
    <Box sx={{ 
      bgcolor: 'background.paper', 
      borderRadius: '16px', 
      p: 3, 
      boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      border: `1px solid ${borderColor}`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Grid
        container
        direction="row"
        justifyContent={{ xs: "center", sm: "flex-start" }}
        alignItems="stretch"
        spacing={4}
      >
        {children}
      </Grid>
    </Box>
  );
}