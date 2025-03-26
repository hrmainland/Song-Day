import React from 'react';
import { Box, Button, Stack } from '@mui/material';

export default function MobileBottomBar({ onCreateClick, onJoinClick }) {
  return (
    <Box sx={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      p: 2, 
      bgcolor: 'background.paper', 
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', 
      display: { xxs: 'flex', sm: 'none' },
      justifyContent: 'center',
      zIndex: 10,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,1) 100%)',
      borderTop: '1px solid rgba(64,126,160,0.1)'
    }}>
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ 
          width: '100%', 
          maxWidth: '400px',
          px: 2
        }}
      >
        <Button 
          variant="outlined" 
          color="primary" 
          fullWidth
          onClick={onCreateClick}
          sx={{ 
            borderRadius: '12px',
            py: 1.5
          }}
        >
          New Session
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          fullWidth
          onClick={onJoinClick}
          sx={{ 
            borderRadius: '12px',
            py: 1.5,
            color: 'white'
          }}
        >
          Join Session
        </Button>
      </Stack>
    </Box>
  );
}