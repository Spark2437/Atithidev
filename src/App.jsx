import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider, useUserContext } from "./contexts/UserContext";
import AuthNavigator from "./Navigator/AuthNavigator";
import MainNavigator from "./Navigator/MainNavigator";
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

const App = () => {
  // Dummy UserId and token
  const UserId = "1a699a3d-bd42-11ef-b8cc-064df626ed42";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMWE2OTlhM2QtYmQ0Mi0xMWVmLWI4Y2MtMDY0ZGY2MjZlZDQyIiwibW9iaWxlX251bWJlciI6IjcwODA0MjU0OTEiLCJleHAiOjE3MzcyNjU4NjF9.UonnMWEPysXbAJR8HY01LfLIVCHnr82EI_0KboOlMXs";
  const isAuthenticated = UserId && token;

  console.log("UserId:", UserId);
  console.log("Token:", token);
  console.log("IsAuthenticated:", isAuthenticated);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          Alert.alert(
            "Update Available",
            "A new version of the app is available. Would you like to update?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Update", onPress: async () => {
                  await Updates.fetchUpdateAsync();
                  await Updates.reloadAsync();
                }
              }
            ]
          );
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    };

    checkForUpdates();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar translucent={true} backgroundColor="transparent" style="dark" />
      {/* Directly start with MainNavigator */}
      <MainNavigator />
    </NavigationContainer>
  );
};

const AppWithProvider = () => (
  <UserProvider>
    <App />
  </UserProvider>
);

export default AppWithProvider;
