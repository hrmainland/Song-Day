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
      // Call the acceptTerms function from context to update backend
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
      
      <DialogContent dividers>
        {tabValue === 0 ? (
          <Box>
            <Paper
              id="terms-content-container"
              elevation={0}
              sx={{
                p: 2,
                maxHeight: '60vh',
                overflow: 'auto',
                bgcolor: 'background.paper'
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    // If checkbox is checked, switch to privacy policy tab
                    if (e.target.checked) {
                      handleTabChange(null, 1);
                    }
                  }}
                  color="primary"
                />
              }
              label="I accept the End-User Agreement"
              sx={{ mt: 2 }}
            />
          </Box>
        ) : (
          <Box>
            <Paper
              id="privacy-content-container"
              elevation={0}
              sx={{
                p: 2,
                maxHeight: '60vh',
                overflow: 'auto',
                bgcolor: 'background.paper'
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={privacyAccepted}
                  onChange={(e) => {
                    setPrivacyAccepted(e.target.checked);
                    // If checkbox is checked but terms not yet accepted, switch to terms tab
                    if (e.target.checked && !termsAccepted) {
                      handleTabChange(null, 0);
                    }
                  }}
                  color="primary"
                />
              }
              label="I accept the Privacy Policy"
              sx={{ mt: 2 }}
            />
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>
        <Button
          onClick={handleAccept}
          variant="contained"
          color="primary"
          disabled={!termsAccepted || !privacyAccepted || isSubmitting}
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
      </DialogActions>
    </Dialog>
  );
}