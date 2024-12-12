import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native"; 

const EventSchedule = ({ route }) => {
  const { eventUUID } = route.params;
  const [eventSchedule, setEventSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchEventSchedule = async () => {
      try {
        const response = await fetch(
          "https://guest-event-app.onrender.com/api/SubEventsdetailsbyuuid",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ EventUUID: eventUUID }),
          }
        );

        const data = await response.json();
        if (data.status_code === 200 && Array.isArray(data.Data)) {
          setEventSchedule(data.Data);
        } else {
          setError("No schedule data found.");
        }
      } catch (err) {
        setError("Error fetching schedule: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventSchedule();
  }, [eventUUID]);

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      locations={[0.3, 0.9]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={{ flex: 1 }}>
      

        <ScrollView contentContainerStyle={styles.scheduleList}>
          {loading ? (
            <ActivityIndicator size="large" color="#D08A76" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            eventSchedule.map((subEvent) => (
              <View
                key={subEvent.SubEventUUID}
                style={styles.scheduleCard}
                onTouchEnd={() => {
                  navigation.navigate("Schedule", {
                    eventUUID: eventUUID, 
                    subEventUUID: subEvent.SubEventUUID, 
                  });
                }}
              >
                <Image
                  source={{ uri: subEvent.Image }}
                  style={styles.subEventImage}
                />
                <View style={styles.scheduleDetails}>
                  <Text style={styles.subEventTitle}>{subEvent.EventName}</Text>
                  <Text style={styles.subEventTime}>
                    {new Date(subEvent.DateandTime).toLocaleString("en-US", {
                      weekday: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <Text style={styles.subEventLocation}>
                    Venue: {subEvent.Placeinvenue}
                  </Text>
                
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    marginTop: 10,
  },
  headerContainer: {
    width: "100%",
    padding: 12,
    backgroundColor: "#D08A76",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  scheduleList: {
    paddingBottom: 16,
    paddingHorizontal: 10,
  },
  scheduleCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
  },
  subEventImage: {
    width: "100%",
    height: 200,
  },
  scheduleDetails: {
    padding: 12,
  },
  subEventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subEventTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  subEventLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  subEventDescription: {
    fontSize: 14,
    color: "#444",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default EventSchedule;
