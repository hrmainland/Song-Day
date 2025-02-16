import { Box, Button, Container, Grid, Badge } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import ShortlistDisplay from "../components/trackDisplays/shortlistDisplay";
import OptionsDisplay from "../components/trackDisplays/optionsDisplay";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import {
  fetchMe,
  fetchGame,
  getAllVotableTracks,
  newVoteGroup,
  getMyVoteGroup,
  addVoteGroupToGame,
} from "../../utils/apiCalls";

import { usefulTrackComponents } from "../../utils/spotifyApiUtils";

export default function VoteSongs() {
  const navigate = useNavigate();
  const { gameCode } = useParams();

  const OPTIONS_KEY = `${gameCode}: options`;
  const SHORTLIST_KEY = `${gameCode}: shortlist`;

  const [initialIds, setInitialIds] = useState([]);
  const [voteLimit, setVoteLimit] = useState(null);
  const [options, setOptions] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [addView, setAddView] = useState(true);
  const [votesSubmitted, setVotesSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  // TODO cleanup so game isn't being retrieved three times
  useEffect(() => {
    const asyncFunc = async () => {
      const game = await fetchGame(gameCode);
      setVoteLimit(game.config.nVotes);
      const myVoteGroup = await getMyVoteGroup(game._id);

      if (myVoteGroup) {
        setVotesSubmitted(true);
      } else {
        setVotesSubmitted(false);
      }
      setLoading(false);

      fetchAndSetIds(game);
      const sessionShortlist = getSessionShortlist();
      if (sessionShortlist.length === 0) {
        setOptionsFromDb(game);
      } else {
        setOptions(getSessionOptions());
        setShortlist(getSessionShortlist());
      }
    };
    asyncFunc();
  }, []);

  const updateView = (event) => {
    event.preventDefault();
    setAddView(!addView);
  }


  // UPDATE
  const fetchAndSetIds = async (game) => {
    const tracksResponse = await getAllVotableTracks(game._id);
    setInitialIds(tracksResponse);
    // setInitialIds(tracksResponse.map((elem) => elem._id));
  };

  const setOptionsFromDb = async (game) => {
    const tracksResponse = await getAllVotableTracks(game._id);
    setSessionOptions(tracksResponse);
    setOptions(tracksResponse);
  };

  const clearLocalStorage = () => {
    setSessionOptions([]);
    setSessionShortlist([]);
    setShortlist([]);
    setOptions([]);
    setOptionsFromDb();
  };

  const getSessionArray = (sessionKey) => {
    let raw = localStorage.getItem(sessionKey);
    try {
      const result = JSON.parse(raw);
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
    // localStorage.setItem(sessionKey, data);
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
    if (voteLimit - getSessionShortlist().length) {
      // remove track from option
      removeOption(index);

      // local storage
      const sessionShortlist = getSessionShortlist();
      sessionShortlist.push(track);
      setSessionShortlist(sessionShortlist);

      // state
      setShortlist(sessionShortlist);
    }
  };

  const shortlistToOptions = (track, shortlistIndex) => {
    // remove track from shortlist
    removeShortlist(shortlistIndex);

    var removedCount = 0;
    const sessionShortlist = getSessionShortlist();
    const shortlistSet = new Set(sessionShortlist.map((track) => track.id));
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

  // update this once votegroup has changed
  const submitShortlist = async () => {
    const game = await fetchGame(gameCode);
    const sessionShortlist = getSessionShortlist();
    var items = [];
    for (let [index, track] of sessionShortlist.entries()) {
      const item = { track: track._id, vote: index };
      items.push(item);
    }

    const voteGroup = await newVoteGroup(game._id, items);
    await addVoteGroupToGame(game._id, voteGroup._id);

    navigate(`/session/${gameCode}`, {
      state: { alertMsg: "Your votes were successfully recorded" },
    });
  };

  if (loading) {
    return loading;
  }

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
        {votesSubmitted ? (
          <Box display="flex" justifyContent="center">
            <h2>You've already submitted your votes</h2>
          </Box>
        ) : (
          <>
          <Grid container>
            <Grid item xs={12} display="flex" justifyContent="center" marginY={2}>
              {addView ? (
              <Badge badgeContent={shortlist.length} color="warning">
                <Button onClick={() => setAddView(false)} variant="contained">
                  Go To Shortlist
                </Button>
              </Badge>
              ) : (
                <Button onClick={() => setAddView(true)} variant="outlined">
                  Back To Options
                </Button>
              )}
            </Grid>
          </Grid>

            <Box
              display="flex"
              justifyContent="center"
              sx={{
                display: addView ? "flex" : "none",
              }}
            >
              <div>{options.map((id) => usefulTrackComponents(id))}</div>
              {/* <OptionsDisplay
                tracks={getSessionOptions.map((track) => usefulTrackComponents(track))}
                addFunc={addTrackToShortlist}
                // todo add tooltip on list item by passing this through
                missingTracks={voteLimit - getSessionShortlist().length}
              ></OptionsDisplay> */}
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              sx={{
                display: addView ? "none" : "flex",
              }}
            >
              <DragDropContext onDragEnd={onDragEnd}>
                {/* <ShortlistDisplay
                  tracks={getSessionShortlist()}
                  removeFunc={shortlistToOptions}
                  submitFunc={submitShortlist}
                  missingTracks={voteLimit - getSessionShortlist().length}
                ></ShortlistDisplay> */}
              </DragDropContext>
            </Box>
          </>
        )}
      </Container>
    </>
  );
}

