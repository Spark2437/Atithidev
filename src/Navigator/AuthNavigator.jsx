import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Auth/LoginScreen";
import OTPScreen from "../screens/Auth/OTPScreen";
import MainNavigator from "./MainNavigator"; 
import { useUserContext } from "../contexts/UserContext"; 

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const { UserId, token } = useUserContext();

  const isAuthenticated = UserId && token;

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? 'Main' : 'LoginScreen'}>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OTPScreen"
        component={OTPScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Main" 
        component={MainNavigator} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
