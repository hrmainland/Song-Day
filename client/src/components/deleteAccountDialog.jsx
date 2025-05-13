import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  Divider,
  CircularProgress,
  Alert
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { deleteMe } from "../../utils/apiCalls";
import { UserContext } from "../context/userProvider";

export default function DeleteAccountDialog({ open, onClose }) {
  const navigate = useNavigate();
  const { setUserId } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [redirectTimer, setRedirectTimer] = useState(null);

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await deleteMe();

      if (result.success) {
        // Clear user data from context
        setUserId(null);

        // Show success message and set up redirect
        setSuccess(true);

        // Set up a delayed redirect to prevent immediate navigation
        const timer = setTimeout(() => {
          navigate('/home-login', { replace: true });
          onClose();
        }, 2000);

        setRedirectTimer(timer);
      } else {
        throw new Error(result.error?.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("An error occurred while deleting your account. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      // Clear any pending redirect timer
      if (redirectTimer) {
        clearTimeout(redirectTimer);
        setRedirectTimer(null);
      }

      setError("");
      setSuccess(false);
      onClose();
    }
  };

  // Clean up the timer if the component unmounts
  React.useEffect(() => {
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [redirectTimer]);

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
          <DeleteIcon sx={{ color: 'error.main', mr: 1.5, fontSize: 28 }} />
          <Typography variant="h5" fontWeight={600} sx={{ letterSpacing: '-0.3px' }}>
            Delete Account
          </Typography>
        </Box>
        <IconButton 
          edge="end" 
          onClick={handleClose}
          aria-label="close"
          sx={{ color: 'text.secondary' }}
          disabled={loading}
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
            Your account has been deleted successfully. Redirecting...
          </Alert>
        )}
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          mt: 4
        }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ 
              borderRadius: '12px',
              px: 3,
              py: 1.25,
              width: '48%'
            }}
            disabled={loading || success}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
            sx={{ 
              borderRadius: '12px',
              px: 3,
              py: 1.25,
              width: '48%',
              position: 'relative'
            }}
            disabled={loading || success}
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
                <span style={{ opacity: 0 }}>Delete Account</span>
              </>
            ) : (
              'Delete Account'
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}