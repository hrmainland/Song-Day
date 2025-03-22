import { useState, useEffect } from "react";
import baseUrl from "../../utils/urlPrefix";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import theme from "../../utils/theme";

import Navbar from "../components/navbar";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { ParallaxProvider } from "react-scroll-parallax";
import { Parallax } from "react-scroll-parallax";

import { Link } from "react-router-dom";

import { useParallax } from "react-scroll-parallax";

const Component = () => {
  const { ref } = useParallax({ speed: 10 });
  return (
    <div
      ref={ref}
      className="my-thing"
      style={{ backgroundColor: "red", width: "60%", height: "60vh" }}
    >
      test
    </div>
  );
};

const SlowComponent = () => {
  const { ref } = useParallax({ speed: 2 });
  return (
    <div
      ref={ref}
      className="my-thing"
      style={{ backgroundColor: "blue", width: "100%", height: "100vh" }}
    >
      test
    </div>
  );
};

const Heading = () => {
  const { ref } = useParallax({ speed: 10 });
};

export default function Test() {
  return (

    <ParallaxProvider>
      <Parallax speed={-200}>
        <div className="home-background">
          <Parallax speed={50}>
            <Grid container spacing={6} justifyContent={"center"}>
              <Grid item xs={12} textAlign={"center"}>
                <h1 className="heading">Song Day</h1>
              </Grid>
              <Grid item xs={12} textAlign="center">
                <Button
                  variant="outlined"
                  component={Link}
                  to="/home"
                  sx={{
                    textTransform: "none",
                    color: "white",
                    borderColor: "lightslategray",
                    "&:hover": {
                      borderColor: "white",
                    },
                    fontSize: "1.1rem",
                    fontFamily: "Inria Sans",
                  }}
                >
                  Get Started
                </Button>
              </Grid>
            </Grid>
          </Parallax>
        </div>
      </Parallax>
      <div className="white-div">
        <br />
        <div>
          <h2>How it works:</h2>
          <p>
            This will be the home page.
          </p>
        </div>
      </div>
    </ParallaxProvider>
  );
}
