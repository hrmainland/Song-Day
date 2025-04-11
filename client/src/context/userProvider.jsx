// UserContext.js
import { createContext, useContext, useState, useEffect } from "react";
import {isLoggedIn} from "../../utils/apiCalls";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false);

  // Check if logged in on first mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedIn = await isLoggedIn();
      setUser(loggedIn);
    };
    checkLoggedIn();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
