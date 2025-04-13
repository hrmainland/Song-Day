import React from 'react';
import Dialog from "@mui/material/Dialog";
import { 
  Box, 
  Button, 
  Typography, 
  IconButton,
  Divider,
  DialogContent,
  DialogTitle,
  ThemeProvider
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import theme from "../../utils/theme";
import baseUrl from "../../utils/urlPrefix";

export default function LoginDialog({ open, onClose }) {
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
            <Box 
              sx={{ 
                width: '150px', 
                height: '150px', 
                border: '1px dashed rgba(0,0,0,0.2)',
                borderRadius: '16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Spotify Logo Placeholder
              </Typography>
            </Box>
            
            {/* TODO put this into api calls */}
            <form action={`${baseUrl}/user/auth`}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ 
                  borderRadius: '12px',
                  py: 1.5,
                  px: 4,
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(64,126,160,0.25)',
                  fontSize: '1rem',
                  textTransform: 'none',
                  mb: 1
                }}
              >
                Continue with Spotify
              </Button>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}