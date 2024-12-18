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

  const formattedDateTime = new Date(nextEvent?.DateandTime).toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, 
  });

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      locations={[0.3, 0.9]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {nextEvent?.Image && (
          <Image source={{ uri: nextEvent.Image }} style={styles.image} />
        )}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{nextEvent?.EventName}</Text>
          <Text style={styles.dateTime}>{formattedDateTime}</Text>
          <Text style={styles.shortDescription}>
            {nextEvent?.ShortDescription}
          </Text>
        </View>

        {nextEvent?.LocationImage && (
          <Image
            source={{ uri: nextEvent.LocationImage }}
            style={styles.locationImage}
          />
        )}

        <Text style={styles.location}>Venue: {nextEvent?.Placeinvenue}</Text>

        <TouchableOpacity style={styles.mapButton} onPress={handleMapLink}>
          <Text style={styles.mapButtonText}>View Location on Map</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 0,
  },
  image: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
    borderRadius: 10,
    marginTop: 15,
  },
  locationImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginTop: 15,
    borderRadius: 10,
  },
  detailsContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  dateTime: {
    fontSize: 16,
    color: "black",
  },
  location: {
    fontSize: 16,
    marginBottom: 5,
    color: "black",
  },
  shortDescription: {
    fontSize: 16,
    marginTop: 10,
    color: "black",
  },
  mapButton: {
    paddingVertical: 12,
    marginBottom: 10,
    backgroundColor: "#D08A76",
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  mapButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    textAlign: "center",
    color: "red",
  },
});

export default NextEvent;
