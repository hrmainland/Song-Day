import React from "react";
import { Grid, Paper, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function MovePhasePaper({
    onButtonClick,
    title,
    text,
    buttonText,
    color,
    bgColor,
}) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: "16px",
        background: `linear-gradient(145deg, #ffffff, ${bgColor})`,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={7}>
          <Typography
            variant="h6"
            sx={{
              mb: 2.5,
              color: `${color}.dark`,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
            }}
          >
            {title}
          </Typography>

          <Typography variant="body1" paragraph>
            {text}
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          sm={5}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            onClick={onButtonClick}
            variant="contained"
            color={color}
            sx={{
              color: "white",
              borderRadius: "10px",
              minWidth: { xs: "100%", sm: "220px" },
              fontSize: "1rem",
              py: { xs: 1.5, sm: 1.2 },
              px: { xs: 3, sm: 2.5 },
              fontWeight: 600,
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                bgcolor: "rgba(0, 0, 0, 0.12)",
              },
            }}
            startIcon={<ArrowForwardIcon />}
          >
            {buttonText}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

