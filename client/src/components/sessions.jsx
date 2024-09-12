import baseUrl from "../../utils/urlPrefix";

import { Grid } from "@mui/material";
import Session from "./session";
import { useState, useEffect } from "react";
import { fetchMe } from "../../utils/apiCalls";
import { useNavigate } from "react-router-dom";

function Sessions() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [mySessions, setMySessions] = useState(null);

  // set user id
  useEffect(() => {
    const callBackend = async () => {
      const me = await fetchMe();
      setUserId(me._id);
    };
    callBackend();
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

  const handleSessionClick = (gameCode) => {
    navigate(`/session/${gameCode}`);
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {mySessions.map((session) => (
          <Session
            key={session.gameCode}
            name={session.title}
            onClick={() => handleSessionClick(session.gameCode)}
          />
        ))}
      </Grid>
    </>
  );
}

export default Sessions;
