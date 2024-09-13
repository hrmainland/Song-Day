import baseUrl from "../../utils/urlPrefix";

import { Grid } from "@mui/material";
import Session from "./session";
import { useState, useEffect } from "react";
import { fetchMe, fetchMyGames } from "../../utils/apiCalls";
import { useNavigate } from "react-router-dom";

function Sessions() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [myGames, setMyGames] = useState(null);

  // set user id
  useEffect(() => {
    const callBackend = async () => {
      const me = await fetchMe();
      setUserId(me._id);
    };
    callBackend();
  }, []);

  // set my games
  useEffect(() => {
    const fetchGameAndSet = async () => {
      const data = await fetchMyGames();
      setMyGames(data);
    };
    if (userId) {
      fetchGameAndSet();
    }
  }, [userId]);

  if (!myGames) {
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
        {myGames.map((game) => (
          <Session
            key={game.gameCode}
            name={game.title}
            onClick={() => handleSessionClick(game.gameCode)}
          />
        ))}
      </Grid>
    </>
  );
}

export default Sessions;
