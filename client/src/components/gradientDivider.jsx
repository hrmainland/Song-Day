import React from 'react';
import { Box } from '@mui/material';

export default function GradientDivider() {
  return (
    <Box 
      sx={{
        mb: 4,
        mx: 'auto',
        height: '1px',
        width: '100%',
        maxWidth: '500px',
        background: 'linear-gradient(90deg, rgba(93,74,156,0) 0%, rgba(93,74,156,0.5) 50%, rgba(93,74,156,0) 100%)',
      }}
    />
  );
}