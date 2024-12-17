import React, { useState, useEffect, useRef } from "react";
import { View, Image, Text, StyleSheet, Animated } from "react-native";

const SplashScreenEvents = ({ route, navigation }) => {
  const { eventUUID, UserId } = route.params;
  const [splashData, setSplashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current; 

  useEffect(() => {
  
    fetch("https://guest-event-app.onrender.com/api/Spalshscreen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ EventUUID: eventUUID, UserId: UserId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status_code === 200) {
          setSplashData(data.Data[0]);
        } else {
          setSplashData({ EventImage: "default_image_url" });
        }
      })
      .catch((err) => {
        setSplashData({ EventImage: "default_image_url" });
        console.error("Error fetching splash screen data: " + err.message);
      })
      .finally(() => setLoading(false));

 
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0, 
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
       
        navigation.replace("EventDetails", { eventUUID, UserId });
      });
    }, 1000); 

    return () => clearTimeout(timer);
  }, [eventUUID, UserId, navigation, fadeAnim]);

  if (loading) {
    return <Text style={styles.loadingText}>Loading splash screen...</Text>;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {splashData?.EventImage ? (
        <Image source={{ uri: splashData.EventImage }} style={styles.image} />
      ) : (
        <Text style={styles.noImageText}>No splash screen image available</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1D3B3",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  noImageText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "red",
  },
});

export default SplashScreenEvents;
