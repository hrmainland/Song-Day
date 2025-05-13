
import { createContext, useContext, useState, useEffect } from "react";
import { fetchMyId, checkTermsStatus, acceptTerms } from "../../utils/apiCalls";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => {
    const savedUser = localStorage.getItem("userId");
    return savedUser ? savedUser : null;
  });

  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [termsLoading, setTermsLoading] = useState(true);

  // Check if logged in on first mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const userId = await fetchMyId();

        if (userId) {
          localStorage.setItem("userId", userId);
          setUserId(userId);

          // If user is logged in, check terms status
          await checkUserTermsStatus();
        } else {
          // If null response, user is not logged in
          localStorage.removeItem("userId");
          setUserId(null);
          setTermsLoading(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        localStorage.removeItem("userId");
        setUserId(null);
        setTermsLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Check the user's terms acceptance status
  const checkUserTermsStatus = async () => {
    try {
      setTermsLoading(true);
      const status = await checkTermsStatus();
      setHasAcceptedTerms(status?.hasAcceptedTerms || false);
    } catch (error) {
      console.error("Error checking terms status:", error);
      setHasAcceptedTerms(false);
    } finally {
      setTermsLoading(false);
    }
  };

  // Accept the terms of service
  const acceptUserTerms = async () => {
    try {
      setTermsLoading(true);
      const result = await acceptTerms();
      if (result?.success) {
        setHasAcceptedTerms(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error accepting terms:", error);
      return false;
    } finally {
      setTermsLoading(false);
    }
  };

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
    <UserContext.Provider
      value={{
        userId,
        setUserId: updateUser,
        hasAcceptedTerms,
        termsLoading,
        acceptTerms: acceptUserTerms,
        refreshTermsStatus: checkUserTermsStatus
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
