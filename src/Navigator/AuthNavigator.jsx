import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Auth/LoginScreen";  // Ensure the path is correct
import OTPScreen from "../screens/Auth/OTPScreen";  // Ensure the path is correct

const Stack = createStackNavigator();

const AuthNavigator = ({ setIsAuthenticated }) => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{
      headerStyle: { backgroundColor: "#d8b4a0" },
      headerTintColor: "#000",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ title: "Login" }}
    />
    <Stack.Screen
      name="OTPScreen"
      component={(props) => <OTPScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      options={{ title: "OTP Verification" }}
    />
  </Stack.Navigator>
);

export default AuthNavigator;