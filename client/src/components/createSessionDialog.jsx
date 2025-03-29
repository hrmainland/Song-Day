import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  IconButton,
  Divider,
  DialogContent,
  DialogTitle,
  Grid,
  CircularProgress
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { useNavigate } from "react-router-dom";
import { addGameToMe, newGame } from "../../utils/apiCalls";

export default function CreateSessionDialog({ open, onClose }) {
  const navigate = useNavigate();
  const [numSongs, setNumSongs] = useState("");
  const [numVotes, setNumVotes] = useState("");
  const [gameName, setGameName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!gameName || !numSongs || !numVotes) {
      return;
    }
    
    setLoading(true);
    try {
      const settings = { numSongs, numVotes };
      const game = await newGame(gameName, settings);
      await addGameToMe(game._id);
      
      // Close the current dialog
      onClose();
      
      // Navigate to game page and pass showGameCodeDialog state
      navigate(`/session/${game.gameCode}`, { 
        state: { showGameCodeDialog: true }
      });
      
      // Reset the form
      setNumSongs("");
      setNumVotes("");
      setGameName("");
    } catch (error) {
      console.error("Error creating session:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
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
            <AddCircleIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 28 }} />
            <Typography variant="h5" fontWeight={600} sx={{ letterSpacing: '-0.3px' }}>
              Create New Session
            </Typography>
          </Box>
          <IconButton 
            edge="end" 
            onClick={onClose}
            aria-label="close"
            sx={{ color: 'text.secondary' }}
            disabled={loading}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
              Configure your new music session settings below.
            </Typography>
          </Box>
          
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Session Name"
                  variant="outlined"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  InputProps={{
                    sx: { 
                      borderRadius: '12px'
                    }
                  }}
                  required
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Songs Per Player"
                  variant="outlined"
                  value={numSongs}
                  onChange={(e) => setNumSongs(e.target.value)}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <LibraryMusicIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    ),
                    sx: { 
                      borderRadius: '12px'
                    }
                  }}
                  required
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Votes Per Player"
                  variant="outlined"
                  value={numVotes}
                  onChange={(e) => setNumVotes(e.target.value)}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <HowToVoteIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    ),
                    sx: { 
                      borderRadius: '12px'
                    }
                  }}
                  required
                  disabled={loading}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              mt: 4
            }}>
              <Button 
                type="submit"
                variant="contained" 
                color="primary"
                size="large"
                fullWidth
                disabled={loading || !gameName || !numSongs || !numVotes}
                sx={{ 
                  borderRadius: '12px',
                  py: 1.5,
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(64,126,160,0.25)',
                  fontSize: '1rem'
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Session"
                )}
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}