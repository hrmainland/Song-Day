import { useState, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tab,
  Tabs,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Paper
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import termsOfService from '../data/endUserAgreement';
import privacyPolicy from '../data/privacyPolicy';
import { UserContext } from '../context/userProvider';

export default function TermsDialog({ open, onClose }) {
  const [tabValue, setTabValue] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { acceptTerms } = useContext(UserContext);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    // Use setTimeout to ensure the tab content has rendered
    setTimeout(() => {
      // Scroll the dialog content to the top
      const contentEl = document.querySelector('.MuiDialogContent-root');
      if (contentEl) {
        contentEl.scrollTop = 0;
      }

      // Scroll the appropriate content container based on the tab
      const containerId = newValue === 0 ? 'terms-content-container' : 'privacy-content-container';
      const containerEl = document.getElementById(containerId);
      if (containerEl) {
        containerEl.scrollTop = 0;
      }
    }, 50);
  };

  const handleAccept = async () => {
    if (!termsAccepted || !privacyAccepted) return;

    setIsSubmitting(true);
    try {
      const success = await acceptTerms();
      if (success) {
        onClose(true);
      } else {
        console.error("Failed to accept terms");
      }
    } catch (error) {
      console.error("Error accepting terms:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset checkbox states when closing without accepting
    setTermsAccepted(false);
    setPrivacyAccepted(false);
    onClose(false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      scroll="paper"
      aria-labelledby="terms-dialog-title"
    >
      <DialogTitle id="terms-dialog-title">
        End-User Agreement & Privacy Policy
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="terms tabs">
          <Tab label="End-User Agreement" id="terms-tab" />
          <Tab label="Privacy Policy" id="privacy-tab" />
        </Tabs>
      </Box>
      
      <DialogContent
        dividers
        sx={{
          height: '60vh',
          p: 0
        }}
      >
        {tabValue === 0 ? (
          <Box sx={{ height: '100%' }}>
            <Paper
              id="terms-content-container"
              elevation={0}
              sx={{
                p: 2,
                height: '100%',
                overflow: 'auto',
                bgcolor: 'background.paper',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <ReactMarkdown
                components={{
                  h1: (props) => <Typography variant="h4" gutterBottom {...props} />,
                  h2: (props) => <Typography variant="h5" gutterBottom sx={{ mt: 3 }} {...props} />,
                  h3: (props) => <Typography variant="h6" gutterBottom sx={{ mt: 2 }} {...props} />,
                  h4: (props) => <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }} {...props} />,
                  p: (props) => <Typography variant="body1" paragraph {...props} />,
                  ul: (props) => <Box component="ul" sx={{ pl: 4 }} {...props} />,
                  li: (props) => <Typography component="li" variant="body1" sx={{ mb: 1 }} {...props} />,
                  a: (props) => <Typography component="a" color="primary" {...props} />
                }}
              >
                {termsOfService.content}
              </ReactMarkdown>
            </Paper>
          </Box>
        ) : (
          <Box sx={{ height: '100%' }}>
            <Paper
              id="privacy-content-container"
              elevation={0}
              sx={{
                p: 2,
                height: '100%',
                overflow: 'auto',
                bgcolor: 'background.paper',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <ReactMarkdown
                components={{
                  h1: (props) => <Typography variant="h4" gutterBottom {...props} />,
                  h2: (props) => <Typography variant="h5" gutterBottom sx={{ mt: 3 }} {...props} />,
                  h3: (props) => <Typography variant="h6" gutterBottom sx={{ mt: 2 }} {...props} />,
                  h4: (props) => <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }} {...props} />,
                  p: (props) => <Typography variant="body1" paragraph {...props} />,
                  ul: (props) => <Box component="ul" sx={{ pl: 4 }} {...props} />,
                  li: (props) => <Typography component="li" variant="body1" sx={{ mb: 1 }} {...props} />,
                  a: (props) => <Typography component="a" color="primary" {...props} />
                }}
              >
                {privacyPolicy.content}
              </ReactMarkdown>
            </Paper>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{
        flexDirection: 'column',
        alignItems: 'stretch',
        p: 2,
        pb: 3,
        gap: 2
      }}>
        {/* Checkbox Container */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 1
        }}>
          {/* Terms Checkbox */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            border: tabValue === 0 ? '1px solid #3f51b5' : 'none',
            bgcolor: tabValue === 0 ? 'rgba(63, 81, 181, 0.05)' : 'transparent',
            borderRadius: 1.5,
            p: 1
          }}>
            <Checkbox
              id="terms-checkbox"
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked);
                // If checkbox is checked, switch to privacy policy tab
                if (e.target.checked) {
                  handleTabChange(null, 1);
                }
              }}
              color="primary"
              sx={{
                padding: 1.5,
                '& .MuiSvgIcon-root': { fontSize: 28 }
              }}
            />
            <Typography
              component="label"
              htmlFor="terms-checkbox"
              variant="body1"
              sx={{
                cursor: 'pointer',
                fontWeight: 500,
                userSelect: 'none',
                WebkitUserSelect: 'none'
              }}
            >
              I accept the End-User Agreement
            </Typography>
          </Box>

          {/* Privacy Checkbox */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            border: tabValue === 1 ? '1px solid #3f51b5' : 'none',
            bgcolor: tabValue === 1 ? 'rgba(63, 81, 181, 0.05)' : 'transparent',
            borderRadius: 1.5,
            p: 1
          }}>
            <Checkbox
              id="privacy-checkbox"
              checked={privacyAccepted}
              onChange={(e) => {
                setPrivacyAccepted(e.target.checked);
                // If checkbox is checked but terms not yet accepted, switch to terms tab
                if (e.target.checked && !termsAccepted) {
                  handleTabChange(null, 0);
                }
              }}
              color="primary"
              sx={{
                padding: 1.5,
                '& .MuiSvgIcon-root': { fontSize: 28 }
              }}
            />
            <Typography
              component="label"
              htmlFor="privacy-checkbox"
              variant="body1"
              sx={{
                cursor: 'pointer',
                fontWeight: 500,
                userSelect: 'none',
                WebkitUserSelect: 'none'
              }}
            >
              I accept the Privacy Policy
            </Typography>
          </Box>
        </Box>

        {/* Buttons */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2
        }}>
          <Button
            onClick={handleCancel}
            disabled={isSubmitting}
            size="large"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAccept}
            variant="contained"
            color="primary"
            disabled={!termsAccepted || !privacyAccepted || isSubmitting}
            size="large"
            sx={{ px: 3 }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Saving...
              </>
            ) : (
              'Accept'
            )}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}