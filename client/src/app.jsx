// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./routes/home";
import NewGame from "./routes/newGame";
import NewGameCode from "./routes/newGameCode";
import JoinGame from "./routes/joinGame";
import Game from "./routes/game";
import Login from "./routes/login";
import Root from "./routes/root";
import LoginRedirect from "./routes/loginRedirect";
import NotFound from "./routes/notFound";

import { UserProvider } from "./context/userProvider";

import PrivateRoutes from "../utils/privateRoutes";

// for dev only
import Pad from "./routes/pad";

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-redirect" element={<LoginRedirect />} />
          {/* <Route element={<PrivateRoutes />}> */}
            <Route path="/home" element={<Home />} />
            <Route path="/new-session" element={<NewGame />} />
            <Route
              path="/new-session/game-code/:gameCode"
              element={<NewGameCode />}
            />
            <Route path="/join-session" element={<JoinGame />} />
            <Route path="/session/:gameCode" element={<Game />} />
          {/* </Route> */}
          {/* for dev only */}
          <Route path="/pad" element={<Pad />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

