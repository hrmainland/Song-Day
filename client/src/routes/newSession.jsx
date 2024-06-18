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
import Navbar from "../navbar";
import CreateStepper from "../createStepper";
import NumberInput from "../numberInput";
import { FormControl } from "@mui/base/FormControl";

function NewSession() {
  const navigate = useNavigate();
  const [name, setName] = React.useState([]);
  const [numSongs, setNumSongs] = React.useState([]);
  const [gameName, setGameName] = React.useState([]);

  React.useEffect(() => {
    const callBackendAPI = async () => {
      try {
        // maybe add this line to client package.json: "proxy": "http://localhost:3500"
        // TODO make a proper check for logged in user
        const response = await fetch(`${baseURL}/user/display-name`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const body = await response.json();
        if (body === "None") {
          // add this page to the session so it knows where to return to
          // TODO change from test
          navigate("/login");
        }
        setName(body);
      } catch (error) {
        console.error(error.message);
      }
    };
    callBackendAPI();
  }, []);

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
        navigate(`/new-session/game-code/${data.gameCode}`);
      })
      .catch((error) => {
        // Handle errors
        console.error("There was a problem with your fetch operation:", error);
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
