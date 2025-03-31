import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { 
  Box, 
  Button, 
  Typography, 
  IconButton,
  Divider,
  DialogContent,
  DialogTitle,
  Paper,
  Tooltip,
  Snackbar,
  Alert,
  ThemeProvider
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from "react-router-dom";
import theme from "../../utils/theme";

export default function GameCodeDialog({ open, onClose, gameCode, gameName }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(gameCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
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
            <CelebrationIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 28 }} />
            <Typography variant="h5" fontWeight={600} sx={{ letterSpacing: '-0.3px' }}>
              Session Created!
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
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 2 }}>
              Your session "{gameName}" has been created successfully. Share this code with other players to join:
            </Typography>
          </Box>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2.5, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '12px',
              border: '1px dashed',
              borderColor: 'primary.main',
              bgcolor: 'rgba(64,126,160,0.05)',
              mb: 3
            }}
          >
            <Typography 
              variant="h3" 
              sx={{ 
                letterSpacing: '4px', 
                fontWeight: 500,
                // fontSize: {lg: '1rem', md: '0.7rem', sm: '0.5rem'},
                fontSize: '1.5rem',
                color: 'primary.dark',
                ml: 2
              }}
            >
              {gameCode}
            </Typography>
            
            <Tooltip title="Copy code" placement="top">
              <IconButton 
                onClick={handleCopy} 
                color="primary" 
                sx={{ mr: 1 }}
              >
                {copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
              </IconButton>
            </Tooltip>
          </Paper>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mt: 3
          }}>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              fullWidth
              onClick={onClose}
              sx={{ 
                borderRadius: '12px',
                py: 1.5,
                color: 'white',
                boxShadow: '0 4px 12px rgba(64,126,160,0.25)',
                fontSize: '1rem',
                textTransform: 'none'
              }}
            >
              Get Started
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      
      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setCopied(false)} severity="success" sx={{ width: '100%' }}>
          Game code copied to clipboard!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}