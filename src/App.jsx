import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider, useUserContext } from "./contexts/UserContext"; 
import AuthNavigator from "./Navigator/AuthNavigator";
import MainNavigator from "./Navigator/MainNavigator";
import { StatusBar } from 'expo-status-bar'; 

const App = () => {
  const { UserId, token } = useUserContext(); 

  const isAuthenticated = UserId && token;

  console.log("UserId:", UserId); 
  console.log("Token:", token);   
  console.log("IsAuthenticated:", isAuthenticated); 

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