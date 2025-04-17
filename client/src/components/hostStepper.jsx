import React, { useContext, useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useGame } from "../hooks/useGame";
import { UserContext } from "../context/userProvider";
import { gameStatus } from "../../utils/gameUtils";

export default function HostStepper({ myTracksSubmitted, myVotesSubmitted }) {
  const { game } = useGame();
  const steps = ["Add Songs", "Vote", "Create Playlist", "Enjoy"];

  if (!game) {
    return;
  }

  const getStepContent = () => {
    if (game.status === gameStatus.add && !myTracksSubmitted) {
      return {activeStep: 0, stepText: `Add songs to you list, then submit to continue.`};
    } else if (game.status === gameStatus.add && myTracksSubmitted) {
        return {activeStep: 1, stepText: 'Move to voting once everyone has submitted their songs.'};
    } else if (game.status === gameStatus.vote && !myVotesSubmitted) {
        return {activeStep: 1, stepText: `Vote on your favourite songs.`};
    } else if (game.status === gameStatus.vote && myVotesSubmitted) {
        return {activeStep: 2, stepText: `Create the playlist once everyone has voted.`};
    } else if (game.status === gameStatus.completed) {
        return {activeStep: 3, stepText: `Your playlist is ready!`};
    }
  };

  const {activeStep, stepText} = getStepContent();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        border: "1px solid rgba(64,126,160,0.1)",
      }}
    >
      {/* Stepper Component */}
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Navigation description */}
      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 3 }}
      >
        {stepText}
      </Typography>
    </Paper>
  );
}
