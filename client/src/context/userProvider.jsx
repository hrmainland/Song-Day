// UserContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { fetchMyId, fetchAccessToken } from "../../utils/apiCalls";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => {
    const savedUser = localStorage.getItem("userId");
    return savedUser ? savedUser : null;
  });
  const [accessToken, setAccessToken] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(true);

  // Check if logged in on first mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const userId = await fetchMyId();

        if (userId) {
          localStorage.setItem("userId", userId);
          setUserId(userId);
        } else {
          // If null response, user is not logged in
          localStorage.removeItem("userId");
          setUserId(null);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        localStorage.removeItem("userId");
        setUserId(null);
      }
    };

    checkLoggedIn();
  }, []);

  // Update function to also update localStorage
  const updateUser = (newUser) => {
    if (newUser) {
      localStorage.setItem("userId", newUser);
    } else {
      localStorage.removeItem("userId");
    }
    setUserId(newUser);
  };

  useEffect(() => {
    const checkAccessToken = async () => {
      if (!userId) {
        setTokenLoading(false);
        return;
      }
      try {
        const accessToken = await fetchAccessToken();
        setAccessToken(accessToken);
        setTokenLoading(false);
      } catch (error) {
        console.error("Error checking access token:", error);
        setTokenLoading(false);
      }
    };
    checkAccessToken();
  }, [userId]);

  return (
    <UserContext.Provider value={{ userId, setUserId: updateUser, accessToken, tokenLoading }}>
      {children}
    </UserContext.Provider>
  );
};
