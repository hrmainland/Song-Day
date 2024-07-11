import baseUrl from "../../utils/urlPrefix";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import * as React from "react";
import { isLoggedIn } from "../../utils/apiCalls";

const LoginRedirect = () => {
  const returnTo = localStorage.getItem("returnTo");

  if (returnTo) {
    return <Navigate to={returnTo} />;
  }
  return <Navigate to="/" />;
};

export default LoginRedirect;
