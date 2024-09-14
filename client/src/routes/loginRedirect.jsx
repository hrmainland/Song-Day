import { Navigate } from "react-router-dom";

export default function LoginRedirect() {
  const returnTo = localStorage.getItem("returnTo");

  if (returnTo) {
    return <Navigate to={returnTo} />;
  }
  return <Navigate to="/" />;
}
