import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Box, Button, Grid, TextField, Input } from "@mui/material";
import SearchBar from "./searchBar";

import { useState, useEffect, useRef } from 'react';

export default function SearchDialog({ open, onClose }) {

  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      if (open) {
        inputRef.current.focus();
      }
    }, 100);
  }, [open]);


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      TransitionComponent={React.Fragment}
      PaperProps={{
        sx: {
          width: "1000px",
          borderRadius: "20px", // Rounded corners applied to the dialog's paper
          padding: 4, // Optional: makes it look nicer
          position: "absolute",
          top: "127px",
        },
      }}
    >
      <SearchBar ref={inputRef}></SearchBar>
      {/* <Input inputRef={inputRef}></Input> */}
      <Box display="flex" justifyContent="center" sx={{ margin: 5 }}>
        Search Results...
      </Box>
    </Dialog>
  );
}

