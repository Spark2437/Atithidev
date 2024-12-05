import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

import MainNavigator from "./Navigator/MainNavigator"; // Main app navigation

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true to skip auth flow
  const [isLoading, setIsLoading] = useState(false); // Set to false to bypass splash screen

  // Commenting out splash screen logic
  /*
  const videoRef = useRef(null);

  useEffect(() => {
    // Simulating app loading or authentication process
    setTimeout(() => {
      setIsLoading(false); // After 3 seconds, hide splash screen
    }, 3000);
  }, []);
  */

  if (isLoading) {
    // Render splash screen while the app is loading
    return (
      <View style={styles.splashContainer}>
        {/* <Video
          ref={videoRef}
          source={require("./src/assets/splash.mp4")} // Path to your video file
          style={styles.video}
          resizeMode="cover"
          shouldPlay
          isLooping={false} // Play once
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              videoRef.current.pauseAsync();
            }
          }}
        /> */}
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
   
      <NavigationContainer>
        {isAuthenticated ? <MainNavigator /> : null} {/* Directly render MainNavigator */}
      </NavigationContainer>

  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Splash screen background color
  },
  video: {
    width: "100%",
    height: "100%",
  },
});

export default App;
