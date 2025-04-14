// UserContext.js
import { createContext, useContext, useState, useEffect } from "react";
import {fetchMyId} from "../../utils/apiCalls";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => {
    const savedUser = localStorage.getItem("userId");
    return savedUser ? savedUser : null;
  });

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

  return (
    <UserContext.Provider value={{ userId, setUserId: updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
