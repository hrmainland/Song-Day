import baseUrl from "../../utils/urlPrefix";

/* eslint-disable no-undef */
import * as React from "react";
import {
  Stepper,
  Box,
  Step,
  StepLabel,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
} from "@mui/material";
import baseURL from "../../utils/urlPrefix";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import CreateStepper from "../components/createStepper";
import NumberInput from "../components/numberInput";
import { FormControl } from "@mui/base/FormControl";

function NewSession() {
  const navigate = useNavigate();
  const [numSongs, setNumSongs] = React.useState([]);
  const [gameName, setGameName] = React.useState([]);

  const addGameToPlayer = (gameId) => {
    fetch(`${baseURL}/user/game/${gameId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          // If response is not OK (not in the range 200-299), throw an error
          throw new Error("Network response was not ok");
        }
        // Otherwise, proceed to parse the JSON
        return response.json();
      })
      .catch((error) => {
        // Handle errors
        console.error(
          "There was a problem adding the game to the current user",
          error
        );
      });
  };

  const submit = () => {
    fetch(`${baseURL}/game/new`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameName,
        numSongs,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // If response is not OK (not in the range 200-299), throw an error
          throw new Error("Network response was not ok");
        }
        // Otherwise, proceed to parse the JSON
        return response.json();
      })
      .then((data) => {
        // add the game to the current user
        addGameToPlayer(data.gameCode);

        navigate(`/new-session/game-code/${data.gameCode}`);
      })
      .catch((error) => {
        // Handle errors
        console.error(
          "There was a problem adding the game to the database:",
          error
        );
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit();
  };

  return (
    <>
      <Navbar></Navbar>
      <Container
        fixed
        className="top-container"
        sx={{
          mt: 5,
        }}
      >
        {/* form goes here */}
        <Box display="flex" justifyContent="center">
          <Grid container maxWidth={600}>
            <h1>Create New Session</h1>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      onChange={(e) => {
                        setGameName(e.target.value);
                      }}
                      label="Game Name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      inputProps={{ type: "number" }}
                      onChange={(e) => {
                        setNumSongs(e.target.value);
                      }}
                      label="Songs Per Player"
                    />
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
      </Container>
    </>
  );
}

export default NewSession;
