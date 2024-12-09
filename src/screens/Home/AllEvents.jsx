import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const AllEvents = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://guest-event-app.onrender.com/api/Upcomingevent", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status_code === 200) {
          setEvents(data.Data); 
        } else {
          setError("Failed to fetch events.");
        }
      })
      .catch((err) => setError("Error fetching events: " + err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleEventPress = (event, userId) => {
    // Pass the EventUUID and UserId to SplashScreenEvents
    navigation.navigate("SplashScreenEvents", {
      eventUUID: event.EventUUID,
    });
  };

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      locations={[0.3, 0.9]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={{ flex: 1 }}>
       

        <ScrollView contentContainerStyle={styles.eventList}>
          {loading ? (
            <Text style={styles.loadingText}>Loading events...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            events.map((event) => (
              <TouchableOpacity
                key={event.EventUUID}
                onPress={() => handleEventPress(event)}
              >
                <View style={styles.eventCard}>
                  {event.EventImage && (
                    <Image
                      source={{ uri: event.EventImage }}
                      style={styles.eventImage}
                    />
                  )}
                  <View style={styles.eventDetails}>
                    <Text style={styles.eventTitle}>{event.EventName}</Text>
                    <Text style={styles.eventCoupleName}>
                      Couple: {event.CoupleName}
                    </Text>
                    <Text style={styles.eventLocation}>{event.EventCity}</Text>
                    <Text style={styles.eventVenue}>Venue: {event.EventVenue}</Text>
                    
                    <Text style={styles.eventDate}>
                      Starts: {new Date(event.EventStartDate).toLocaleString()}
                    </Text>
                    <Text style={styles.eventDate}>
                      Ends: {new Date(event.EventEndDate).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1, flexDirection: "column", backgroundColor: "transparent" },
  headerContainer: {
    width: "100%",
    padding: 6,
    backgroundColor: "#D08A76",
    alignItems: "center",
    marginBottom: 20,
  },
  
  eventList: {
    paddingBottom: 16,
  },
  eventCard: {
    flexDirection: "column",
    backgroundColor: "#fff",
    marginTop:30, 
    borderRadius: 10,
    
    overflow: "hidden",
    elevation: 4,
    marginLeft: 10,
    marginRight: 10,
  },
  eventImage: {
    width: "100%",
    height: 400,
  },
  eventDetails: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: "RobotoBold",
  },
  eventLocation: {
    fontSize: 14,
    color: "#666",
  },
  eventVenue: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },
  eventCoupleName: {
    fontSize: 14,
    color: "#444",
    marginTop: 2,
  },
  eventDate: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "red",
  },
});

export default AllEvents;