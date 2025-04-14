import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeNew() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/home", {
      replace: true,
      state: { from: "/home-new" },
    });
  }, [navigate]);

  return null;
}
