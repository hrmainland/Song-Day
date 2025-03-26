import React from 'react';
import { Box, Typography } from '@mui/material';

export default function SessionsHeader({ title, color = 'secondary.main', boxShadow = '0 2px 8px rgba(93,74,156,0.3)' }) {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 3
    }}>
      <Box 
        sx={{ 
          width: '8px', 
          height: '28px', 
          bgcolor: color, 
          borderRadius: '4px',
          mr: 2,
          boxShadow: boxShadow
        }} 
      />
      <Typography 
        variant="h5" 
        fontWeight="500" 
        sx={{ letterSpacing: '-0.3px' }}
      >
        {title}
      </Typography>
    </Box>
  );
}