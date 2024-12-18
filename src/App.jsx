import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider, useUserContext } from "./contexts/UserContext"; 
import AuthNavigator from "./Navigator/AuthNavigator";
import MainNavigator from "./Navigator/MainNavigator";
import { StatusBar } from 'expo-status-bar'; 
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

const App = () => {
  const { UserId, token } = useUserContext(); 
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
              { text: "Update", onPress: async () => {
                  await Updates.fetchUpdateAsync();
                  await Updates.reloadAsync();
                } }
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
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />} 
    </NavigationContainer>
  );
};

const AppWithProvider = () => (
  <UserProvider>
    <App />
  </UserProvider>
);

export default AppWithProvider;
