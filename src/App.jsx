import React, { useEffect, useState, useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider, useUserContext } from "./contexts/UserContext"; // Import UserContext
import AuthNavigator from "./Navigator/AuthNavigator";
import MainNavigator from "./Navigator/MainNavigator";
import { AsyncStorage } from "react-native";

const App = () => {
  const { userId, setUserId } = useUserContext(); // Fetch userId from context
  const [isChecked, setIsChecked] = useState(false); // To track if user is logged in

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId"); 
        if (storedUserId) {
          setUserId(storedUserId); // Set userId in context
        }
      } catch (error) {
        console.error("Error fetching userId from AsyncStorage", error);
      } finally {
        setIsChecked(true); // Mark check as complete
      }
    };

    checkUserStatus(); // Run checkUserStatus when app starts
  }, [setUserId]);

  // Wait until user status is checked before rendering anything
  if (!isChecked) {
    return null; // You can add a loading screen here
  }

  return (
    <NavigationContainer>
      {userId ? <MainNavigator /> : <AuthNavigator />}  {/* Conditional navigation */}
    </NavigationContainer>
  );
};

// Wrap App with UserProvider to ensure context is available throughout
const AppWithProvider = () => (
  <UserProvider>
    <App />
  </UserProvider>
);

export default AppWithProvider;
