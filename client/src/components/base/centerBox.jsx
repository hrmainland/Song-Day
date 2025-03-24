import React from 'react';
import { Box } from '@mui/material';

export default function CenterBox ({ maxWidth, p, children }) {
  return (
    <Box
      sx={{
        maxWidth: maxWidth,
        marginLeft: 'auto',
        marginRight: 'auto',
        p: p,
      }}
    >
      {children}
    </Box>
  );
};

