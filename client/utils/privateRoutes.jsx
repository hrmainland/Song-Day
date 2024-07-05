import baseUrl from "./urlPrefix";
import { Outlet, Navigate } from "react-router-dom";
import * as React from "react";

const PrivateRoutes = () => {
  // const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // React.useEffect(() => {
  //   const callBackendAPI = async () => {
  //     try {
  //       // maybe add this line to client package.json: "proxy": "http://localhost:3500"
  //       // TODO make a proper check for logged in user
  //       const response = await fetch(`${baseUrl}/user/display-name`);
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch data");
  //       }
  //       const body = await response.json();
  //       if (body) {
  //         setIsLoggedIn(true);
  //       }
  //       // if (body === "None") {
  //       //   // add this page to the session so it knows where to return to
  //       //   return false;
  //       // }
  //       // return true;
  //     } catch (error) {
  //       console.error(error.message);
  //     }
  //   };
  //   callBackendAPI();
  // }, []);

  // let auth = { token: true };
  return true ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
