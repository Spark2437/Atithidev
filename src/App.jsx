import React, { useEffect, Suspense } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider, useUserContext } from "./contexts/UserContext"; 
import * as Updates from 'expo-updates';
import { Alert, Text } from 'react-native';


const AuthNavigator = React.lazy(() => import("./Navigator/AuthNavigator"));

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
      <Suspense fallback={<Text>Loading...</Text>}>
        <AuthNavigator />
      </Suspense>
    </NavigationContainer>
  );
};

const AppWithProvider = () => (
  <UserProvider>
    <App />
  </UserProvider>
);

export default AppWithProvider;
