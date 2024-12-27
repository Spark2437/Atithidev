import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    UserId: "1a699a3d-bd42-11ef-b8cc-064df626ed42",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMWE2OTlhM2QtYmQ0Mi0xMWVmLWI4Y2MtMDY0ZGY2MjZlZDQyIiwibW9iaWxlX251bWJlciI6IjcwODA0MjU0OTEiLCJleHAiOjE3MzcyNjU4NjF9.UonnMWEPysXbAJR8HY01LfLIVCHnr82EI_0KboOlMXs"
  });

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
