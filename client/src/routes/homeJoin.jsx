import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeJoin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/home", {
      replace: true,
      state: { from: "/home-join" },
    });
  }, [navigate]);

  return null;
}
