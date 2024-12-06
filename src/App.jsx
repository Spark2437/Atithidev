import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider } from "./contexts/UserContext";  // Import UserProvider
import AuthNavigator from "./Navigator/AuthNavigator"; // Import AuthNavigator
import MainNavigator from "./Navigator/MainNavigator"; // Import MainNavigator

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Start with not authenticated

  return (
    // Wrap everything with UserProvider to make sure context is accessible
    <UserProvider>
      <NavigationContainer>
        {/* Render either AuthNavigator or MainNavigator based on authentication status */}
        {isAuthenticated ? (
          <MainNavigator /> // User is authenticated, show main app
        ) : (
          <AuthNavigator setIsAuthenticated={setIsAuthenticated} /> // Pass setIsAuthenticated to AuthNavigator
        )}
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
