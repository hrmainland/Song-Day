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
  CircularProgress,
  FormHelperText
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

  // Validation states
  const [errors, setErrors] = useState({
    gameName: "",
    numSongs: "",
    numVotes: ""
  });

  // Validation functions
  const validateGameName = (name) => {
    if (!name) return "Session name is required";
    if (name.length < 1) return "Session name is too short";
    if (name.length > 50) return "Session name must be less than 50 characters";
    return "";
  };

  const validateNumSongs = (value) => {
    if (!value) return "Number of songs is required";
    const num = Number(value);
    if (isNaN(num)) return "Must be a number";
    if (num < 1) return "Minimum is 1 song";
    if (num > 100) return "Maximum is 100 songs";
    return "";
  };

  const validateNumVotes = (value) => {
    if (!value) return "Number of votes is required";
    const num = Number(value);
    if (isNaN(num)) return "Must be a number";
    if (num < 1) return "Minimum is 1 vote";
    if (num > 100) return "Maximum is 100 votes";
    return "";
  };

  // Handle input changes with validation
  const handleGameNameChange = (e) => {
    const value = e.target.value;
    setGameName(value);
    setErrors(prev => ({
      ...prev,
      gameName: validateGameName(value)
    }));
  };

  const handleNumSongsChange = (e) => {
    const value = e.target.value;
    setNumSongs(value);
    setErrors(prev => ({
      ...prev,
      numSongs: validateNumSongs(value)
    }));
  };

  const handleNumVotesChange = (e) => {
    const value = e.target.value;
    setNumVotes(value);
    setErrors(prev => ({
      ...prev,
      numVotes: validateNumVotes(value)
    }));
  };

  const isFormValid = !errors.gameName && !errors.numSongs && !errors.numVotes &&
                       gameName && numSongs && numVotes;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate all fields before submission
    const gameNameError = validateGameName(gameName);
    const numSongsError = validateNumSongs(numSongs);
    const numVotesError = validateNumVotes(numVotes);

    setErrors({
      gameName: gameNameError,
      numSongs: numSongsError,
      numVotes: numVotesError
    });

    if (gameNameError || numSongsError || numVotesError) {
      return;
    }

    setLoading(true);
    try {
      const settings = {
        numSongs: Number(numSongs),
        numVotes: Number(numVotes)
      };
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
      setErrors({ gameName: "", numSongs: "", numVotes: "" });
    } catch (error) {
      console.error("Error creating session:", error);
      // Handle server validation errors
      if (error.response && error.response.data && error.response.data.errors) {
        const serverErrors = error.response.data.errors;
        const newErrors = { ...errors };

        serverErrors.forEach(err => {
          if (err.param === 'gameName') newErrors.gameName = err.msg;
          if (err.param === 'settings.numSongs') newErrors.numSongs = err.msg;
          if (err.param === 'settings.numVotes') newErrors.numVotes = err.msg;
        });

        setErrors(newErrors);
      }
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
                  onChange={handleGameNameChange}
                  InputProps={{
                    sx: {
                      borderRadius: '12px'
                    }
                  }}
                  required
                  disabled={loading}
                  error={!!errors.gameName}
                  helperText={errors.gameName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Songs Per Player"
                  variant="outlined"
                  value={numSongs}
                  onChange={handleNumSongsChange}
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
                  error={!!errors.numSongs}
                  helperText={errors.numSongs}
                  inputProps={{ min: 1, max: 100 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Votes Per Player"
                  variant="outlined"
                  value={numVotes}
                  onChange={handleNumVotesChange}
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
                  error={!!errors.numVotes}
                  helperText={errors.numVotes}
                  inputProps={{ min: 1, max: 100 }}
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
                disabled={loading || !isFormValid}
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