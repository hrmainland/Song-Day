import * as React from "react";
import { Box, Button, TextField, Container, Grid } from "@mui/material";
import baseUrl from "../../utils/urlPrefix";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import VoteChoiceDisplay from "../components/trackDisplays/voteChoiceDisplay";
import VoteListDisplay from "../components/trackDisplays/voteListDisplay";
import TrackList from "../components/trackList";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { fetchMe, fetchGame, getAllVotableTracks } from "../../utils/apiCalls";

function VoteSongs() {
  const { gameCode } = useParams();
  const [votableTracks, SetVotableTracks] = useState([]);
  const [chosenTracks, SetChosenTracks] = useState([]);

  useEffect(() => {
    const asyncFunc = async () => {
      const me = await fetchMe();
      const game = await fetchGame(gameCode);
      const tracksResponse = await getAllVotableTracks(game._id);
      SetVotableTracks(tracksResponse);
    };
    asyncFunc();
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newOrder = Array.from(votableTracks);
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);

    SetVotableTracks(newOrder);
  };

  const removeTrackAtIndex = (index) => {
    SetVotableTracks((prev) => {
      const newTracks = [...prev];
      newTracks.splice(index, 1);
      return newTracks;
    });
  };

  const addTrack = (track, index) => {
    SetChosenTracks((prevChosenTracks) => [...prevChosenTracks, track]);
    removeTrackAtIndex(index);
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
            tracks={votableTracks}
            addFunc={addTrack}
          ></VoteListDisplay>
          <DragDropContext onDragEnd={onDragEnd}>
            <VoteChoiceDisplay tracks={chosenTracks}></VoteChoiceDisplay>
          </DragDropContext>
        </Box>
      </Container>
    </>
  );
}

export default VoteSongs;
