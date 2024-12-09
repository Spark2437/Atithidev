import React, { createContext, useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native"; // Ensure AsyncStorage is imported

// Create context
const UserContext = createContext();

// Define provider
export const UserProvider = ({ children }) => {
  const [UserID, setUserID] = useState(null);

  const checkUserStatus = async () => {
    const storedUserID = await AsyncStorage.getItem('UserID');
    if (storedUserID) {
      setUserID(storedUserID);  // This will set the UserID in the context
    }
  };

  useEffect(() => {
    checkUserStatus();  // Automatically check user status on initial render
  }, []);

  return (
    <UserContext.Provider value={{ UserID, setUserID, checkUserStatus }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
