import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  
  // Save the userId
  const saveUserId = (id) => {
    setUserId(id);
  };


  return (
    <UserContext.Provider value={{ userId,  saveUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user context
export const useUser = () => {
  return useContext(UserContext);
};
