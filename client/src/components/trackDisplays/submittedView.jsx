import React from "react";
import { Typography, Box } from "@mui/material";
import CenterBox from "../base/centerBox";

export default function SubmittedView() {
  return (
    <CenterBox
      maxWidth="1000px"
      p={3}
      sx={{
        mt: 2,
        mb: 4,
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="h5" textAlign="center" sx={{ mb: 2 }}>
        You've already submitted your tracks
      </Typography>
      <Typography variant="body1" textAlign="center" color="text.secondary">
        Your tracks have been successfully added to the session. Check back
        later to see the final playlist.
      </Typography>
    </CenterBox>
  );
}