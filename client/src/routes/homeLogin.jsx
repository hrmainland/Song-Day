import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/home", {
      replace: true,
      state: { from: "/home-login" },
    });
  }, [navigate]);

  return null;
}
