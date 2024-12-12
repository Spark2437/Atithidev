import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";

const SplashScreenEvents = ({ route, navigation }) => {
  const { eventUUID, UserId } = route.params; 
  const [splashData, setSplashData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://guest-event-app.onrender.com/api/Spalshscreen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ EventUUID: eventUUID, UserId: UserId }),  // Sending UserId with the request
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status_code === 200) {
          setSplashData(data.Data[0]); // Fetch the first event from the response
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
      // Pass both eventUUID and UserId to EventDetails
      navigation.replace("EventDetails", { eventUUID, UserId });  // Passing UserId along with eventUUID
    }, 3000); // Navigate to EventDetails after 3 seconds

    return () => clearTimeout(timer);
  }, [eventUUID, UserId, navigation]);  // Add UserId as a dependency

  if (loading) {
    return <Text style={styles.loadingText}>Loading splash screen...</Text>;
  }

  return (
    <View style={styles.container}>
      {splashData?.EventImage ? (
        <Image source={{ uri: splashData.EventImage }} style={styles.image} />
      ) : (
        <Text style={styles.noImageText}>No splash screen image available</Text>
      )}
    </View>
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
