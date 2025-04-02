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
  TextField,
  InputAdornment,
  ThemeProvider,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import FaceIcon from '@mui/icons-material/Face';
import theme from "../../utils/theme";
import { updateDisplayName } from "../../utils/apiCalls";

export default function DisplayNameDialog({ open, onClose, game }) {
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (displayName && displayName.length >= 2) {
      setIsSubmitting(true);
      try {
        await updateDisplayName(game._id, displayName);
        onClose(displayName);
      } catch (error) {
        console.error("Error updating display name:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={() => onClose(null)}
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
            <Typography variant="h5" fontWeight={600} sx={{ letterSpacing: '-0.3px' }}>
              Set Your Display Name
            </Typography>
          </Box>
          <IconButton 
            edge="end" 
            onClick={() => onClose(null)}
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
              Please enter a display name that will be visible to other players in the "{game.title}" session:
            </Typography>
          </Box>

          <TextField 
            fullWidth 
            label="Display Name" 
            variant="outlined"
            placeholder="eg. Jeff"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaceIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              sx: { 
                borderRadius: '12px',
                fontSize: '1.1rem',
              }
            }}
            sx={{ mb: 3 }}
            autoFocus
          />
          
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
              onClick={handleSubmit}
              disabled={!displayName || displayName.length < 2 || isSubmitting}
              sx={{ 
                borderRadius: '12px',
                py: 1.5,
                color: 'white',
                boxShadow: '0 4px 12px rgba(64,126,160,0.25)',
                fontSize: '1rem',
                textTransform: 'none'
              }}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}