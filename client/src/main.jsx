import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NewSession from "./routes/newSession";
import Root from "./routes/root";
import "./index.css";

// this creates the router object
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/new-session",
    element: <NewSession />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
