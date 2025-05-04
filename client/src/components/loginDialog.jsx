import React, { useState } from 'react';
import Dialog from "@mui/material/Dialog";
import { 
  Box, 
  Button, 
  Typography, 
  IconButton,
  Divider,
  DialogContent,
  DialogTitle,
  ThemeProvider,
  CircularProgress
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import theme from "../../utils/theme";
import baseUrl from "../../utils/urlPrefix";

export default function LoginDialog({ open, onClose, redirectTo }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Navigate to the Spotify auth endpoint
    localStorage.setItem("returnTo", redirectTo);
    window.location.href = `${baseUrl}/user/auth`;
    
    // Note: The navigation above will redirect the page, but we'll
    // set a timeout in case there's any delay to show the spinner
    setTimeout(() => {
      setIsLoading(false);
    }, 10000); // Safety timeout in case redirect fails
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          },
        }}
      >
        <DialogTitle sx={{ 
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MusicNoteIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 28 }} />
            <Typography variant="h5" fontWeight={600} sx={{ letterSpacing: '-0.3px' }}>
              Login
            </Typography>
          </Box>
          <IconButton 
            edge="end" 
            onClick={onClose}
            aria-label="close"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ p: 3, pt: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary" paragraph>
              You'll need to connect your Spotify account to create or join sessions.
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <form onSubmit={handleSubmit}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ 
                  borderRadius: '12px',
                  py: 1.5,
                  px: 4,
                  backgroundColor: isLoading ? '#1DB954' : 'white',
                  color: isLoading ? 'white' : '#1DB954',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  fontSize: '1rem',
                  textTransform: 'none',
                  mb: 1,
                  minWidth: '220px',
                  '&:hover': {
                    backgroundColor: isLoading ? '#1DB954' : '#f5f5f5',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#1DB954',
                    color: 'white',
                  }
                }}
                startIcon={
                  !isLoading && (
                    <Box 
                      component="img"
                      src="/Spotify_Icon.svg"
                      alt="Spotify"
                      sx={{ 
                        height: 24,
                        mr: 1
                      }}
                    />
                  )
                }
              >
                {isLoading ? (
                  <CircularProgress 
                    size={24} 
                    sx={{ 
                      color: 'white' 
                    }} 
                  />
                ) : (
                  'Continue with Spotify'
                )}
              </Button>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}