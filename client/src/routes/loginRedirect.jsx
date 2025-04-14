import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userProvider";


export default function LoginRedirect() {
  
  const { user, setUser } = useContext(UserContext);
  // TODO setUser with user stored in context

  const returnTo = localStorage.getItem("returnTo");
  localStorage.removeItem("returnTo");

  if (returnTo) {
    return <Navigate to={returnTo} />;
  }
  return <Navigate to="/home" />;
}
