import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Alert,
  CircularProgress
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import KeyIcon from '@mui/icons-material/Key';
import GroupsIcon from '@mui/icons-material/Groups';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { 
  fetchGameInfo, 
  fetchMe, 
  addGameToMe, 
  addMeToGame 
} from "../../utils/apiCalls";

export default function JoinSessionDialog({ open, onClose }) {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  
  const handleCodeChange = (event) => {
    setCode(event.target.value.toUpperCase());
    // Clear any existing errors when the user types
    if (error) setError('');
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!code || code.trim() === '') {
      setError('Please enter a session code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Fetch the game with the provided code  
      const game = await fetchGameInfo(code);
      
      if (!game) {
        setError("Session not found. Please check the code and try again.");
        setLoading(false);
        return;
      }
      
      // Check if user is already part of the game
      const me = await fetchMe();
      const userId = me._id;
      const isPlayerInGame = game.players && game.players.some(player => player.user === userId);
      
      if (isPlayerInGame) {
        setAlreadyJoined(true);
        // Navigate after a short delay to show success message
        setTimeout(() => {
          navigate(`/session/${game.gameCode}`);
          onClose();
        }, 1000);
        setLoading(false);
        return;
      }
      
      // Add user to the game
      await addGameToMe(game._id);
      await addMeToGame(game._id);
      
      // Show success message and navigate
      setSuccess(true);
      setTimeout(() => {
        navigate(`/session/${game.gameCode}`);
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Error joining session:', error);
      setError('An error occurred while joining the session. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    // Reset state when dialog is closed
    setCode('');
    setError('');
    setSuccess(false);
    setAlreadyJoined(false);
    setLoading(false);
    onClose();
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          onClick={handleClose}
          aria-label="close"
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              alignItems: 'center',
              borderRadius: '12px'
            }}
            icon={<ErrorOutlineIcon fontSize="inherit" />}
          >
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3, 
              alignItems: 'center',
              borderRadius: '12px'  
            }}
            icon={<CheckCircleOutlineIcon fontSize="inherit" />}
          >
            Successfully joined the session! Redirecting...
          </Alert>
        )}

        {alreadyJoined && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 3, 
              alignItems: 'center',
              borderRadius: '12px'  
            }}
            icon={<CheckCircleOutlineIcon fontSize="inherit" />}
          >
            You're already part of that session! Redirecting...
          </Alert>
        )}
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Enter the session code provided by the host to join their music session.
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField 
            fullWidth 
            label="Session Code" 
            variant="outlined"
            placeholder="XXXX-XXXX-XXXX"
            value={code}
            onChange={handleCodeChange}
            error={!!error}
            disabled={loading || success}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              sx: { 
                borderRadius: '12px',
                fontSize: '1.1rem',
              }
            }}
            inputProps={{
              maxLength: 12,
              style: { 
                textTransform: 'uppercase',
                letterSpacing: '2px',
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
              disabled={loading || success || code.length < 12}
              sx={{ 
                borderRadius: '12px',
                py: 1.5,
                color: 'white',
                boxShadow: '0 4px 12px rgba(93,74,156,0.25)',
                fontSize: '1rem',
                position: 'relative'
              }}
            >
              {loading ? (
                <>
                  <CircularProgress 
                    size={24} 
                    sx={{ 
                      color: 'white',
                      position: 'absolute',
                      left: 'calc(50% - 12px)',
                      top: 'calc(50% - 12px)'
                    }} 
                  />
                  <span style={{ opacity: 0 }}>Join Session</span>
                </>
              ) : success ? (
                'Joined Successfully!'
              ) : (
                'Join Session'
              )}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}
