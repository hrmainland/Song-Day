// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./routes/home";

import NewGameCode from "./routes/newGameCode";

import Game from "./routes/game";
import Login from "./routes/login";
import Root from "./routes/root";
import LoginRedirect from "./routes/loginRedirect";
import HomeLogin from "./routes/homeLogin";
import HomeNew from "./routes/homeNew";
import HomeJoin from "./routes/homeJoin";
import NoSessionFound from "./routes/noSessionFound";
import NotFound from "./routes/notFound";

import { UserProvider } from "./context/userProvider";
import { GameProvider } from "./context/gameContext";

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
          <Route path="/home-login" element={<HomeLogin />} />
          <Route path="/home-new" element={<HomeNew />} />
          <Route path="/home-join" element={<HomeJoin />} />
          {/* <Route element={<PrivateRoutes />}> */}
            <Route path="/home" element={<Home />} />
            <Route
              path="/new-session/game-code/:gameCode"
              element={<NewGameCode />}
            />
            <Route 
              path="/session/:gameCode" 
              element={
                <GameProvider>
                  <Game />
                </GameProvider>
              } 
            />
          {/* </Route> */}
          {/* for dev only */}
          <Route path="/pad" element={<Pad />} />
          <Route path="/no-session-found" element={<NoSessionFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

