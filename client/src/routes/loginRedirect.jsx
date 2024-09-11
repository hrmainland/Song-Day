import { Navigate } from "react-router-dom";

const LoginRedirect = () => {
  const returnTo = localStorage.getItem("returnTo");

  if (returnTo) {
    return <Navigate to={returnTo} />;
  }
  return <Navigate to="/" />;
};

export default LoginRedirect;
