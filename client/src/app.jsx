// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./routes/home";

import NewGame from "./routes/newGame";
import NewGameCode from "./routes/newGameCode";
import JoinGame from "./routes/joinGame";
import Game from "./routes/game";

import AddSongs from "./routes/addSongs";
import VoteSongs from "./routes/voteSongs";
import CreatePlaylist from "./routes/createPlaylist";
import Login from "./routes/login";
import Test from "./routes/test";
import Grid from "./routes/grid";
import Pad from "./routes/pad";
import Root from "./routes/root";
import LoginRedirect from "./routes/loginRedirect";
import NotFound from "./routes/notFound";

import PrivateRoutes from "../utils/privateRoutes";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-redirect" element={<LoginRedirect />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/new-session" element={<NewGame />} />
          <Route
            path="/new-session/game-code/:gameCode"
            element={<NewGameCode />}
          />
          <Route path="/join-session" element={<JoinGame />} />
          <Route path="/session/:gameCode" element={<Game />} />
          <Route path="/session/:gameCode/add-songs" element={<AddSongs />} />
          <Route path="/session/:gameCode/vote" element={<VoteSongs />} />
          <Route
            path="/session/:gameCode/create-playlist"
            element={<CreatePlaylist />}
          />
        </Route>

        {/* TODO remove these tests */}
        <Route path="/test" element={<Test />} />
        <Route path="/grid" element={<Grid />} />
        <Route path="/pad" element={<Pad />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

