import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Linking,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useUserContext } from "../../contexts/UserContext";
import Icon from "react-native-vector-icons/FontAwesome";

const AllEvents = ({ navigation }) => {
  const { UserId, token, clearUserData } = useUserContext();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstWord: "",
    username: "",
    mobileNumber: "",
  });
  const [slideAnim] = useState(
    new Animated.Value(-Dimensions.get("window").width * 0.7)
  );

  const toggleProfile = () => {
    console.log("Toggling profile visibility");
    if (!showProfile) {
      setShowProfile(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -Dimensions.get("window").width * 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowProfile(false));
    }
  };

  const fetchUserDetails = async () => {
    console.log("Fetching user details");
    if (!UserId || !token) {
      console.log("UserId or token is missing");
      return;
    }

    try {
      const response = await fetch(
        "https://guest-event-app.onrender.com/api/Userdetailsbyuuid",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            UserId: UserId,
          },
          body: JSON.stringify({ UserId }),
        }
      );

      const data = await response.json();
      console.log("User details response:", data);

      if (data.status_code === 200) {
        const userData = data.Data[0];
        setProfileData({
          firstWord: userData.FirstWord || "A",
          username: userData.Username || "Username",
          mobileNumber: userData.Mobile || "Mobile Number",
        });
      } else {
        setError(data.Remark || "Failed to fetch user details.");
      }
    } catch (err) {
      setError("Error fetching user details: " + err.message);
      console.error("Error fetching user details:", err);
    }
  };

  const fetchEvents = async () => {
    console.log("Fetching events");
    if (!UserId || !token) {
      console.log("UserId or token is missing");
      return;
    }

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
      console.log("Events response:", data);

      if (data.status_code === 200) {
        setEvents(data.Data);
      } else {
        setError(data.Remark || "Failed to fetch events.");
      }
    } catch (err) {
      setError("Error fetching events: " + err.message);
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching data on component mount or UserId/token change");
    fetchUserDetails();
    fetchEvents();
  }, [UserId, token]);

  const handleEventPress = (event) => {
    console.log("Event pressed:", event.EventUUID);
    navigation.navigate("SplashScreenEvents", {
      eventUUID: event.EventUUID,
      UserId: UserId,
    });
  };

  const handleLogout = async () => {
    console.log("Logging out");
    try {
      const response = await fetch("https://guest-event-app.onrender.com/api/Logoutbyuuid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          UserId: UserId,
        },
        body: JSON.stringify({ UserId }),
      });

      const data = await response.json();
      console.log("Logout response:", data);

      if (data.status_code === 200) {
        clearUserData();
        console.log("User logged out, navigating to LoginScreen");
        navigation.replace("LoginScreen");
      } else {
        console.error(data.Remark || "Failed to log out.");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      locations={[0.3, 0.9]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleProfile}>
            <View style={styles.iconContainer}>
              <Icon name="user" size={16} color="#fff" />
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

        {/* Profile Sidebar */}
        {showProfile && (
          <TouchableWithoutFeedback onPress={() => setShowProfile(false)}>
            <Animated.View
              style={[
                styles.profileSidebar,
                { transform: [{ translateX: slideAnim }] },
              ]}
            >
              <View style={styles.profileContent}>
                <View style={styles.profileTop}>
                  <TouchableOpacity>
                    <View style={styles.profilePictureContainer}>
                      <Text style={styles.profileInitials}>
                        {profileData.firstWord?.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.username}>{profileData.username}</Text>
                  <Text style={styles.mobileNumber}>{profileData.mobileNumber}</Text>
                </View>

                <View style={styles.profileLine}></View>

                <View style={styles.profileButtons}>
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() =>
                      Linking.openURL("https://atithidev.com/privacy-policy")
                    }
                  >
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Privacy Policy</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={handleLogout} // Handle logout
                  >
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Logout</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  header: {
    position: "absolute",
    left: 20,
    top: 40,
    zIndex: 1,
    alignItems: "flex-start",
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
  profileSidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "70%",
    backgroundColor: "#fff",
    zIndex: 2,
    elevation: 5,
    padding: 20,
    flexDirection: "column",
  },
  profileContent: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  profileTop: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePictureContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    marginTop: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitials: {
    fontSize: 40,
    color: "#fff",
    backgroundColor: "#333",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    lineHeight: 80,
  },
  profileLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  mobileNumber: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
  profileButtons: {
    marginTop: "auto",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    alignSelf: "flex-start",
    width: 200,
    height: 50,
    backgroundColor: "#D08A76",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  eventList: {
    paddingBottom: 16,
    paddingTop: 20,
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
