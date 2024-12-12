import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; 

const NextEvent = ({ route, navigation }) => {
  const { eventUUID } = route.params; 
  const [nextEvent, setNextEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://guest-event-app.onrender.com/api/NextEventbyuuid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ EventUUID: eventUUID }), 
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status_code === 200 && data.Data.length > 0) {
          setNextEvent(data.Data[0]); 
        } else {
          setError("Failed to fetch next event details.");
        }
      })
      .catch((err) =>
        setError("Error fetching next event details: " + err.message)
      )
      .finally(() => setLoading(false));
  }, [eventUUID]);

  if (loading)
    return <Text style={styles.loadingText}>Loading next event...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  const handleMapLink = () => {
    Linking.openURL(nextEvent?.MapLink);
  };

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      locations={[0.3, 0.9]}
      style={styles.gradientContainer}
    >
      <ScrollView style={styles.container}>
        {nextEvent?.Image && (
          <Image source={{ uri: nextEvent.Image }} style={styles.image} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{nextEvent?.EventName}</Text>
          <Text style={styles.date}>
            Date: {new Date(nextEvent?.DateandTime).toLocaleDateString()}
          </Text>
          <Text style={styles.time}>
            Time: {new Date(nextEvent?.DateandTime).toLocaleTimeString()}
          </Text>
          <Text style={styles.shortDescription}>
            {nextEvent?.ShortDescription}
          </Text>
        </View>

        {/* Display Location Image */}
        {nextEvent?.LocationImage && (
          <Image
            source={{ uri: nextEvent.LocationImage }}
            style={styles.locationImage}
          />
        )}

        {/* Display Location below the Location Image */}
        <Text style={styles.location}>Location: {nextEvent?.Placeinvenue}</Text>

        {/* Map Link */}
        <TouchableOpacity style={styles.mapButton} onPress={handleMapLink}>
          <Text style={styles.buttonText}>View Location on Map</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    marginTop: 40,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  locationImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",

  },
  textContainer: {
    padding: 15,
    marginTop: -10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  shortDescription: {
    fontSize: 14,
    color: "black",
   
  },
  date: {
    fontSize: 14,
    color: "black",
    marginVertical: 1,
  },
  time: {
    fontSize: 14,
    color: "black",
    marginVertical: 1,
  },
  location: {
    fontSize: 14,
    color: "black",
    marginVertical: 1,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    textAlign: "center",
    color: "red",
  },
  mapButton: {
    marginTop: 20,
    backgroundColor: "#D08A76",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default NextEvent;
