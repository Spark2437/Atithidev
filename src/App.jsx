import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider, useUserContext } from "./contexts/UserContext"; 
import AuthNavigator from "./Navigator/AuthNavigator";
import MainNavigator from "./Navigator/MainNavigator";


const App = () => {
  const { UserId, token } = useUserContext(); 

  // Check if both UserId and token are available
  const isAuthenticated = UserId && token;


  console.log("UserId:", UserId); 
  console.log("Token:", token);   
  console.log("IsAuthenticated:", isAuthenticated); 

  return (
    <NavigationContainer>
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
