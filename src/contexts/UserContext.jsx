import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  const saveUserId = (id) => {
    setUserId(id);
  };

  return (
    <UserContext.Provider value={{ userId, saveUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
