import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [UserId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [rsvpStatus, setRsvpStatus] = useState({});

  const checkUserStatus = async () => {
    const storedUserId = await AsyncStorage.getItem("UserId");
    const storedToken = await AsyncStorage.getItem("token");
    const storedRSVPStatus = await AsyncStorage.getItem("rsvpStatus");

    if (storedUserId && storedToken) {
      setUserId(storedUserId);
      setToken(storedToken);
    }

    if (storedRSVPStatus) {
      setRsvpStatus(JSON.parse(storedRSVPStatus));
    }
  };

  const saveUserData = async (userId, token) => {
    await AsyncStorage.setItem("UserId", userId);
    await AsyncStorage.setItem("token", token);
    setUserId(userId);
    setToken(token);
  };

  const updateRSVPStatus = async (eventUUID, status) => {
    const updatedRSVPStatus = { ...rsvpStatus, [eventUUID]: status };
    setRsvpStatus(updatedRSVPStatus);
    await AsyncStorage.setItem("rsvpStatus", JSON.stringify(updatedRSVPStatus));
  };

  const clearUserData = async () => {
    await AsyncStorage.removeItem("UserId");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("rsvpStatus");
    setUserId(null);
    setToken(null);
    setRsvpStatus({});
  };

  useEffect(() => {
    checkUserStatus();
  }, []);

  return (
    <UserContext.Provider value={{ UserId, token, rsvpStatus, saveUserData, updateRSVPStatus, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
