import React, { useState, useContext } from "react";
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
  ThemeProvider,
  TextField,
  InputAdornment,
  FormHelperText
} from "@mui/material";

import CelebrationIcon from '@mui/icons-material/Celebration';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FaceIcon from '@mui/icons-material/Face';
import { Link } from "react-router-dom";
import theme from "../../utils/theme";
import { updateDisplayName } from "../../utils/apiCalls";
import { useGame } from "../hooks/useGame";

export default function GameCodeDialog({ open, onClose }) {
  const { game, refreshGame, loading, error } = useGame();
  const [copied, setCopied] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate display name
  const validateDisplayName = (name) => {
    if (!name) return "Display name is required";
    if (name.length < 1) return "Display name is too short";
    if (name.length > 20) return "Display name must be less than 20 characters";
    return "";
  };

  // Handle display name change
  const handleDisplayNameChange = (e) => {
    const value = e.target.value;
    setDisplayName(value);
    setNameError(validateDisplayName(value));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(game.gameCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = async () => {
    // Validate before submission
    const validationError = validateDisplayName(displayName);
    setNameError(validationError);

    if (!validationError) {
      setIsSubmitting(true);
      try {
        await updateDisplayName(game._id, displayName);
        onClose();
      } catch (error) {
        console.error("Error updating display name:", error);
        // Handle server validation errors
        if (error.response && error.response.data && error.response.data.errors) {
          const serverErrors = error.response.data.errors;
          const displayNameError = serverErrors.find(err => err.param === 'displayName');
          if (displayNameError) {
            setNameError(displayNameError.msg);
          } else {
            setNameError("An error occurred while updating your display name");
          }
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={() => {}} // Prevent dialog from closing on backdrop click or escape key
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown
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
          justifyContent: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CelebrationIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 28 }} />
            <Typography variant="h5" fontWeight={600} sx={{ letterSpacing: '-0.3px' }}>
              Session Created!
            </Typography>
          </Box>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 2 }}>
              Your session "{game.title}" has been created successfully. Complete the steps below to get started:
            </Typography>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography 
              variant="subtitle2" 
              color="primary.dark" 
              fontWeight={600} 
              sx={{ 
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.8
              }}
            >
              <FaceIcon fontSize="small" />
              ENTER YOUR DISPLAY NAME
            </Typography>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Your name"
            value={displayName}
            onChange={handleDisplayNameChange}
            error={!!nameError}
            helperText={nameError}
            InputProps={{
              sx: {
                borderRadius: '12px',
                fontSize: '1.1rem',
              }
            }}
            sx={{ mb: nameError ? 2 : 4 }}
            autoFocus
            disabled={isSubmitting}
          />
          
          <Box sx={{ mb: 1 }}>
            <Typography 
              variant="subtitle2" 
              color="primary.dark" 
              fontWeight={600} 
              sx={{ 
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.8
              }}
            >
              <ContentCopyIcon fontSize="small" />
              SHARE THIS CODE WITH FRIENDS
            </Typography>
          </Box>

          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '12px',
              border: '1px dashed',
              borderColor: 'primary.main',
              bgcolor: 'rgba(64,126,160,0.05)',
              mb: 4,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}
          >
            <Typography 
              variant="h3" 
              sx={{ 
                letterSpacing: '2px', 
                fontWeight: 600,
                fontSize: { xs: '1.5rem', sm: '2rem' },
                color: 'primary.dark',
                wordBreak: 'break-all',
                textAlign: 'center',
                flexGrow: 1,
                mr: 1
              }}
            >
              {game.gameCode}
            </Typography>
            
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCopy}
              startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
              sx={{
                borderRadius: '8px',
                width: { xs: '100%', sm: 'auto' },
                py: { xs: 1, sm: 1 },
                bgcolor: 'rgba(64,126,160,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(64,126,160,0.2)',
                }
              }}
            >
              {copied ? "Copied!" : "Copy Code"}
            </Button>
          </Paper>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mt: 2
          }}>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              fullWidth
              onClick={handleSubmit}
              disabled={isSubmitting || !!nameError || !displayName}
              sx={{ 
                borderRadius: '12px',
                py: 1.8,
                color: 'white',
                boxShadow: '0 4px 12px rgba(64,126,160,0.25)',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(64,126,160,0.35)',
                },
              }}
            >
              Let's Go
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}