import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create context
const UserContext = createContext();

// Define provider
export const UserProvider = ({ children }) => {
  const [UserId, setUserId] = useState(null); 
  const [token, setToken] = useState(null);

  const checkUserStatus = async () => {
    const storedUserId = await AsyncStorage.getItem('UserId'); 
    const storedToken = await AsyncStorage.getItem('token');
    if (storedUserId && storedToken) {
      setUserId(storedUserId);
      setToken(storedToken);
    }
  };

  const saveUserData = async (userId, token) => {
    await AsyncStorage.setItem('UserId', userId); 
    await AsyncStorage.setItem('token', token);
    setUserId(userId);
    setToken(token);
  };

  useEffect(() => {
    checkUserStatus(); 
  }, []);

  return (
    <UserContext.Provider value={{ UserId, token, saveUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);