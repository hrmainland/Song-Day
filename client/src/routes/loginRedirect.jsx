import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userProvider";


export default function LoginRedirect() {
  
  const { user, setUser } = useContext(UserContext);

  const returnTo = localStorage.getItem("returnTo");
  localStorage.removeItem("returnTo");

  if (returnTo && returnTo !== "null") {
    return <Navigate to={returnTo} />;
  }
  return <Navigate to="/home" />;
}
