import React from 'react';
import { Button, Stack } from '@mui/material';

export default function HeaderButtons({ onCreateClick, onJoinClick }) {
  return (
    <Stack
      direction="row"
      spacing={2}
    >
      <Button
        variant="outlined"
        color="primary"
        onClick={onCreateClick}
        sx={{ 
          borderRadius: '12px',
          fontWeight: 500
        }}
      >
        New Session
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={onJoinClick}
        sx={{
          borderRadius: '12px',
          color: "white",
          fontWeight: 500,
          boxShadow: '0 4px 12px rgba(93,74,156,0.25)'
        }}
      >
        Join Session
      </Button>
    </Stack>
  );
}