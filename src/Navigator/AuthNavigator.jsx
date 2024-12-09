import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Auth/LoginScreen";
import OTPScreen from "../screens/Auth/OTPScreen";
import MainNavigator from "./MainNavigator"; 

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
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