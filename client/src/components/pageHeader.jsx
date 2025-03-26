import React from 'react';
import { Box, Typography } from '@mui/material';

export default function PageHeader({ title }) {
  return (
    <Box sx={{ 
      display: 'inline-block', 
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '10px',
        bottom: '2px',
        left: 0,
        backgroundColor: 'rgba(93, 74, 156, 0.2)',
        zIndex: -1,
        borderRadius: '4px'
      }
    }}>
      <Typography variant="h5" fontWeight="500" sx={{ letterSpacing: '-0.5px' }}>
        {title}
      </Typography>
    </Box>
  );
}