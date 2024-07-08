import baseUrl from "./urlPrefix";
import { Outlet, Navigate } from "react-router-dom";
import * as React from "react";
import { isLoggedIn } from "./apiCalls";

const PrivateRoutes = () => {
  const [authenticated, setAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const callBackend = async () => {
      const loggedIn = await isLoggedIn();
      setAuthenticated(loggedIn);
      setLoading(false);
    };
    callBackend();
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }
  return authenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
