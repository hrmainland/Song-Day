/* eslint-disable no-undef */
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Alert,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import baseUrl from "../../utils/urlPrefix";
import { useParams, useLocation, Link } from "react-router-dom";
import Navbar from "../components/navbar";
import { useEffect, useState } from "react";

import { fetchMe, getProfile, searchTracks } from "../../utils/apiCalls";

function Session() {
  const location = useLocation();
  const { gameCode } = useParams();
  const [game, setGame] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState();
  const [alertOpen, setAlertOpen] = useState(!!location.state?.alertMsg);
  const [alertMsg, setAlertMsg] = useState(
    location.state?.alertMsg || "Success!"
  );

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`${baseUrl}/user/id`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setUserId(data);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    // TODO move this fetch
    const fetchGame = async () => {
      try {
        const response = await fetch(`${baseUrl}/game/${gameCode}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setGame(data);
      } catch (error) {
        console.error("Error fetching game data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameCode]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!game) {
    return <div>No game data available.</div>;
  }

  return (
    <>
      <Navbar></Navbar>
      <Button component={Link} to={`/home`}>
        <ArrowBackIcon />
      </Button>

      {alertOpen && (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          onClose={() => {
            setAlertOpen(false);
          }}
        >
          {alertMsg}
        </Alert>
      )}

      <Container
        fixed
        className="top-container"
        sx={{
          mt: 5,
        }}
      >
        <Box display="flex" justifyContent="center">
          <Grid container maxWidth={600}>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                {game.title}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Game Code: {gameCode}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Button
                sx={{ width: "100%" }}
                variant="outlined"
                component={Link}
                to={`/session/${gameCode}/add-songs`}
              >
                Add Songs
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                sx={{ width: "100%" }}
                variant="outlined"
                component={Link}
                to={`/session/${gameCode}/vote`}
              >
                Vote
              </Button>
            </Grid>

            {game.host === userId && (
              <Grid item xs={12}>
                <Button
                  sx={{ width: "100%" }}
                  variant="outlined"
                  component={Link}
                  to={`/session/${gameCode}/create-playlist`}
                >
                  Create Playlist
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default Session;
