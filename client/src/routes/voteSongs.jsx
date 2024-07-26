import * as React from "react";
import { Box, Button, TextField, Container, Grid } from "@mui/material";
import baseUrl from "../../utils/urlPrefix";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import ShortlistDisplay from "../components/trackDisplays/shortlistDisplay";
import VoteListDisplay from "../components/trackDisplays/voteListDisplay";
import TrackList from "../components/trackList";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { fetchMe, fetchGame, getAllVotableTracks } from "../../utils/apiCalls";

function VoteSongs() {
  const { gameCode } = useParams();
  const [options, setOptions] = useState([]);
  const [shortlist, setShortlist] = useState([]);

  useEffect(() => {
    const asyncFunc = async () => {
      const me = await fetchMe();
      const game = await fetchGame(gameCode);
      const tracksResponse = await getAllVotableTracks(game._id);
      setOptions(tracksResponse);
    };
    asyncFunc();
  }, []);

  // const onDragEnd = (result) => {};

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newOrder = Array.from(shortlist);
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);

    setShortlist(newOrder);
  };

  const removeTrackAtIndex = (index) => {
    setOptions((prev) => {
      const newTracks = [...prev];
      newTracks.splice(index, 1);
      return newTracks;
    });
  };

  const addTrack = (track, index) => {
    setShortlist((prevChosenTracks) => [...prevChosenTracks, track]);
    removeTrackAtIndex(index);
  };

  const removeTrack = (track, index) => {
    console.log("hello");
  };

  return (
    <>
      <Navbar />
      <Container
        fixed
        className="top-container"
        sx={{
          mt: 5,
        }}
      >
        <Box display="flex" justifyContent="center">
          <VoteListDisplay
            tracks={options}
            addFunc={addTrack}
          ></VoteListDisplay>
          <DragDropContext onDragEnd={onDragEnd}>
            <ShortlistDisplay
              tracks={shortlist}
              removeFunc={removeTrack}
            ></ShortlistDisplay>
          </DragDropContext>
        </Box>
      </Container>
    </>
  );
}

export default VoteSongs;
