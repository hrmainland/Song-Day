import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  IconButton,
  InputAdornment,
  Divider,
  DialogContent,
  DialogTitle,
  DialogActions
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import KeyIcon from '@mui/icons-material/Key';
import GroupsIcon from '@mui/icons-material/Groups';

export default function JoinSessionDialog({ open, onClose }) {
  const [code, setCode] = useState('');
  
  const handleCodeChange = (event) => {
    setCode(event.target.value.toUpperCase());
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    // Process the code submission here
    console.log('Submitted code:', code);
    // Close dialog after submission
    onClose();
  };
  
  return (
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
          <GroupsIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 28 }} />
          <Typography variant="h5" fontWeight={600} sx={{ letterSpacing: '-0.3px' }}>
            Join a Session
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
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
            Enter the 6-digit code provided by the session host to join their music session.
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField 
            fullWidth 
            label="Session Code" 
            variant="outlined"
            placeholder="XXXXXX"
            value={code}
            onChange={handleCodeChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              sx: { 
                borderRadius: '12px',
                fontSize: '1.1rem',
                letterSpacing: '1px'
              }
            }}
            inputProps={{
              maxLength: 6,
              style: { 
                textTransform: 'uppercase',
                letterSpacing: '3px',
                fontWeight: 500
              }
            }}
            helperText="Code is case-insensitive"
            sx={{ mb: 3 }}
            autoFocus
          />
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mt: 2 
          }}>
            <Button 
              type="submit"
              variant="contained" 
              color="secondary"
              size="large"
              fullWidth
              disabled={code.length !== 6}
              sx={{ 
                borderRadius: '12px',
                py: 1.5,
                color: 'white',
                boxShadow: '0 4px 12px rgba(93,74,156,0.25)',
                fontSize: '1rem'
              }}
            >
              Join Session
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
