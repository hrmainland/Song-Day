// TODO update some from baseURL to baseUrl

import baseUrl from "../../utils/urlPrefix";

import { Container, Button, Grid, Typography } from "@mui/material";
import Navbar from "./navbar";
import Session from "./session";
import { useState, useEffect } from "react";

function Sessions() {
  const [userId, setUserId] = useState(null);
  const [mySessions, setMySessions] = useState(null);

  // set user id
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`${baseUrl}/user/get-id`, {
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

  // set my sessions
  useEffect(() => {
    const fetchMySessions = async () => {
      // TODO add error handling here
      const response = await fetch(`${baseUrl}/user/my-games`);

      const data = await response.json();
      setMySessions(data);
    };
    if (userId) {
      fetchMySessions();
    }
  }, [userId]);

  if (!mySessions) {
    return <h1>No sessions</h1>;
  }

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {mySessions.map((session) => (
          <Session key={session.id} name={session.title} />
        ))}
      </Grid>
    </>
  );
}

export default Sessions;
