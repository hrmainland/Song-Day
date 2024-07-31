import * as React from "react";
import { Box, Button, TextField, Container, Grid } from "@mui/material";
import baseUrl from "../../utils/urlPrefix";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import ShortlistDisplay from "../components/trackDisplays/shortlistDisplay";
import OptionsDisplay from "../components/trackDisplays/optionsDisplay";
import TrackList from "../components/trackList";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { fetchMe, fetchGame, getAllVotableTracks } from "../../utils/apiCalls";

function VoteSongs() {
  const { gameCode } = useParams();

  const OPTIONS_KEY = `${gameCode}: options`;
  const SHORTLIST_KEY = `${gameCode}: shortlist`;

  const [initialIds, setInitialIds] = useState([]);
  const [options, setOptions] = useState([]);
  const [shortlist, setShortlist] = useState([]);

  useEffect(() => {
    fetchAndSetIds();

    const sessionShortlist = getSessionShortlist();
    if (sessionShortlist.length === 0) {
      setOptionsFromDb();
    } else {
      setOptions(getSessionOptions());
      setShortlist(getSessionShortlist());
    }
  }, []);

  const fetchAndSetIds = async () => {
    const game = await fetchGame(gameCode);
    const tracksResponse = await getAllVotableTracks(game._id);
    setInitialIds(tracksResponse.map((elem) => elem._id));
  };

  const setOptionsFromDb = async () => {
    const game = await fetchGame(gameCode);
    const tracksResponse = await getAllVotableTracks(game._id);
    setSessionOptions(tracksResponse);
    setOptions(tracksResponse);
  };

  const clearLocalStorage = () => {
    setSessionOptions([]);
    setSessionShortlist([]);
    setShortlist([]);
    setOptions([]);
  };

  const getSessionArray = (sessionKey) => {
    let raw = localStorage.getItem(sessionKey);
    try {
      const result = JSON.parse(raw);
      console.log("sessionKey :>> ", sessionKey);
      console.log("result :>> ", result);
      if (!result) {
        return [];
      }
      return result;
    } catch {
      return [];
    }
  };

  const setSessionArray = (sessionKey, data) => {
    localStorage.setItem(sessionKey, JSON.stringify(data));
  };

  const getSessionOptions = () => getSessionArray(OPTIONS_KEY);
  const getSessionShortlist = () => getSessionArray(SHORTLIST_KEY);

  const setSessionOptions = (data) => setSessionArray(OPTIONS_KEY, data);
  const setSessionShortlist = (data) => setSessionArray(SHORTLIST_KEY, data);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    // session
    const sessionShortlist = getSessionShortlist();
    const [updatedSessionShortlist] = sessionShortlist.splice(
      result.source.index,
      1
    );
    sessionShortlist.splice(
      result.destination.index,
      0,
      updatedSessionShortlist
    );
    setSessionShortlist(sessionShortlist);

    // state

    setShortlist(sessionShortlist);
  };

  const removeOption = (index) => {
    // local storage
    const sessionOptions = getSessionOptions();
    sessionOptions.splice(index, 1);
    setSessionOptions(sessionOptions);

    // state
    setOptions(sessionOptions);
  };

  const removeShortlist = (index) => {
    // local storage
    const sessionShortlist = getSessionShortlist();
    sessionShortlist.splice(index, 1);
    setSessionShortlist(sessionShortlist);

    // state
    setShortlist(sessionShortlist);
  };

  const addTrackToShortlist = (track, index) => {
    // remove track from option
    removeOption(index);

    // local storage
    const sessionShortlist = getSessionShortlist();
    sessionShortlist.push(track);
    setSessionShortlist(sessionShortlist);

    // state
    setShortlist(sessionShortlist);
  };

  const shortlistToOptions = (track, shortlistIndex) => {
    // remove track from shortlist
    removeShortlist(shortlistIndex);

    var removedCount = 0;
    const sessionShortlist = getSessionShortlist();
    const shortlistSet = new Set(sessionShortlist.map((track) => track._id));
    var optionsIndex;
    for (let i = 0; i < initialIds.length; i++) {
      if (initialIds[i] === track._id) {
        optionsIndex = i - removedCount;
      }
      if (shortlistSet.has(initialIds[i])) removedCount++;
    }

    // local storage
    const sessionOptions = getSessionOptions();
    sessionOptions.splice(optionsIndex, 0, track);
    setSessionOptions(sessionOptions);

    // state
    setOptions(sessionOptions);
  };

  const submitShortlist = () => {
    console.log("I've been submitted");
  };

  // TODO add logic for disabled button until song count reached

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
        <Button onClick={clearLocalStorage}>Clear</Button>

        <Box display="flex" justifyContent="center">
          <OptionsDisplay
            // tracks={options}
            tracks={getSessionOptions()}
            addFunc={addTrackToShortlist}
          ></OptionsDisplay>
          <DragDropContext onDragEnd={onDragEnd}>
            <ShortlistDisplay
              tracks={getSessionShortlist()}
              removeFunc={shortlistToOptions}
              submitFunc={submitShortlist}
            ></ShortlistDisplay>
          </DragDropContext>
        </Box>
      </Container>
    </>
  );
}

export default VoteSongs;
