// Navigator/AuthNavigator.js
import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Auth/LoginScreen";
import OTPScreen from "../screens/Auth/OTPScreen"; 
import { useUserContext } from "../contexts/UserContext";

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const { setUserId } = useUserContext(); 
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen 
        name="LoginScreen" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="OTPScreen"
        component={(props) => (
          <OTPScreen 
            {...props} 
            setIsAuthenticated={setIsAuthenticated} 
            setUserId={setUserId}  
          />
        )}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
};

export default AuthNavigator;
