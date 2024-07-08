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
import baseUrl from "../../utils/urlPrefix";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import CreateStepper from "../components/createStepper";
import NumberInput from "../components/numberInput";
import { FormControl } from "@mui/base/FormControl";
import { useEffect, useState } from "react";

function Session() {
  const { gameCode } = useParams();
  const [game, setGame] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState();

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
    // TODO add proper redirect for bad id
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
      <h1>{game.title}</h1>
      {game.host === userId ? (
        <p>You are the host</p>
      ) : (
        <p>You are not the host</p>
      )}
    </>
  );
}

export default Session;
