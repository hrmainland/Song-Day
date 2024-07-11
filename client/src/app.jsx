// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./routes/home";
import NewSession from "./routes/newSession";
import NewSessionCode from "./routes/newSessionCode";
import JoinSession from "./routes/joinSession";
import Session from "./routes/session";
import AddSongs from "./routes/addSongs";
import VoteSongs from "./routes/voteSongs";
import Login from "./routes/login";
import Test from "./routes/test";
import Grid from "./routes/grid";
import Pad from "./routes/pad";
import Root from "./routes/root";
import LoginRedirect from "./routes/loginRedirect";
import NotFound from "./routes/notFound";

import PrivateRoutes from "../utils/privateRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-redirect" element={<LoginRedirect />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/new-session" element={<NewSession />} />
          <Route
            path="/new-session/game-code/:gameCode"
            element={<NewSessionCode />}
          />
          <Route path="/join-session" element={<JoinSession />} />
          <Route path="/session/:gameCode" element={<Session />} />
          <Route path="/session/:gameCode/add-songs" element={<AddSongs />} />
          <Route path="/session/:gameCode/vote" element={<VoteSongs />} />
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

export default App;
