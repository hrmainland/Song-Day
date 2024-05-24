import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NewSession from "./routes/newSession";
import Root from "./routes/root";
import Login from "./routes/login";
import Test from "./routes/test";
import Grid from "./routes/grid";
import Home from "./routes/home";
import Pad from "./routes/pad";

import "./styles.css";

// this creates the router object
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/new-session",
    element: <NewSession />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/test",
    element: <Test />,
  },
  {
    path: "/pad",
    element: <Pad />,
  },
  {
    path: "/grid",
    element: <Grid />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
