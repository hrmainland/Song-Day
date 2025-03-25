import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Box, Button, Grid, TextField } from "@mui/material";

export default function JoinSessionDialog({ open, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "20px", // Rounded corners applied to the dialog's paper
          padding: 4, // Optional: makes it look nicer
        },
      }}
    >
      <Box display="flex" justifyContent="center" sx={{ margin: 5 }}>
        <Grid container maxWidth={600}>
          <h1>Enter Session Code</h1>
          <Grid item xs={12}>
            <form style={{ width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Session Code" />
                </Grid>

                <Grid item xs={12} display="flex" justifyContent="center">
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}
