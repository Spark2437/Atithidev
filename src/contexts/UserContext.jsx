import { createContext, useState, useContext } from "react";

// Create context
const UserContext = createContext();

// Define provider
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  const checkUserStatus = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  };

  return (
    <UserContext.Provider value={{ userId, setUserId, checkUserStatus }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
