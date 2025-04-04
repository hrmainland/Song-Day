import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { isLoggedIn } from "./apiCalls";

export default function PrivateRoutes() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("returnTo", location.pathname);
    const callBackend = async () => {
      const loggedIn = await isLoggedIn();
      // const loggedIn = true
      setAuthenticated(loggedIn);
      setLoading(false);
    };
    callBackend();
  }, []);

  if (loading) {
    return <div>Authenticating...</div>;
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" />;
}
