import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useUserContext } from "../../contexts/UserContext";
import Icon from "react-native-vector-icons/FontAwesome";

const AllEvents = ({ navigation }) => {
  const { UserId, token } = useUserContext();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    const fetchEvents = async () => {
      if (!UserId || !token) return;

      try {
        const response = await fetch(
          "https://guest-event-app.onrender.com/api/UpcomingeventNew",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              UserId: UserId,
            },
            body: JSON.stringify({ UserId, token }),
          }
        );

        const data = await response.json();

        if (data.status_code === 200) {
          setEvents(data.Data);
        } else {
          setError(data.Remark || "Failed to fetch events.");
        }
      } catch (err) {
        setError("Error fetching events: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [UserId, token]);

  const handleEventPress = (event) => {
    navigation.navigate("SplashScreenEvents", {
      eventUUID: event.EventUUID,
      UserId: UserId,
    });
  };

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      locations={[0.3, 0.9]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <View style={styles.iconContainer}>
              <Icon name="question" size={10} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
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
                    <Text style={styles.eventVenue}>
                      Venue: {event.EventVenue}
                    </Text>
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

        {/* Modal for Privacy Policy */}
        <Modal
          visible={showModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
              <ScrollView>
                
              </ScrollView>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => handleLinkPress("https://atithidev.com/privacy-policy")}
              >
                <Text style={styles.linkText}>Read Privacy Policy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  header: {
    position: "absolute",
    right: 20,
    top: 40,
    zIndex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  iconContainer: {
    width: 26,
    height: 26,
    borderRadius: 18,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  eventList: {
    paddingBottom: 16,
    paddingTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },
  linkButton: {
    marginTop: 20,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },

  header: {
    position: 'absolute',
    right: 20,
    top: 40,
    zIndex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  iconContainer: {
    width: 26,
    height: 26,
    borderRadius: 18,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventList: {
    paddingBottom: 16,
    paddingTop: 20
  },
  eventCard: {
    flexDirection: "column",
    backgroundColor: "#fff",
    marginTop: 30,
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