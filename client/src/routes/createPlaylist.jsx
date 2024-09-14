import { Button, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";

import { fetchGame, createPlaylist } from "../../utils/apiCalls";

export default function CreatePlaylist() {
  const { gameCode } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playlistId, setPlaylistId] = useState(null);

  useEffect(() => {
    const asyncFunc = async () => {
      const game = await fetchGame(gameCode);
      setGame(game);
      setLoading(false);
    };
    asyncFunc();
  }, []);

  const handleCreate = async () => {
    const incomingPlaylistId = await createPlaylist(game._id);
    setPlaylistId(incomingPlaylistId);
  };

  return (
    <>
      <Navbar />
      <Button component={Link} to={`/session/${gameCode}`}>
        <ArrowBackIcon />
      </Button>
      <Container
        fixed
        className="top-container"
        sx={{
          mt: 5,
        }}
      >
        <h1>Create Playlist</h1>
        {loading ? (
          <p>Loading... </p>
        ) : (
          <p>There are {game.voteGroups.length} sets of votes submitted</p>
        )}
        {!playlistId ? (
          <Button onClick={handleCreate}>Create Playlist</Button>
        ) : (
          <iframe
            style={{ borderRadius: "12px" }}
            src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
            width="100%"
            height="352"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        )}
      </Container>
    </>
  );
}

