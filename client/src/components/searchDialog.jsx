import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Box, Button, Grid, TextField, Input } from "@mui/material";
import SearchBar from "./searchBar";

import { useState, useEffect, useRef } from 'react';

export default function SearchDialog({ open, onClose }) {

  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      TransitionComponent={React.Fragment}
      // backup focus for mobile
      onTransitionEnter={() => {
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 50);
      }}
      PaperProps={{
        sx: {
          width: { xxs: "90%", sm: "1000px" },
          borderRadius: "20px", // Rounded corners applied to the dialog's paper
          padding: { xxs: 2, sm: 4 }, // Optional: makes it look nicer
          position: "absolute",
          top: { xxs: "100px", sm: "127px" },
          maxHeight: "calc(100vh - 150px)",
          overflow: "auto",
        },
      }}
    >
      <Box sx={{ width: '100%', p: { xxs: 1, sm: 2 } }}>
        <SearchBar ref={inputRef}></SearchBar>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" sx={{ mt: 3, mb: 2 }}>
        <Box sx={{ width: '100%', height: '1px', bgcolor: 'divider', mb: 3 }} />
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover', display: 'flex', justifyContent: 'center' }}>
            Search for songs to add to your list
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}

