import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";

const EventDetails = ({ route, navigation }) => {
  const { eventUUID } = route.params; // Getting eventUUID from route params, userId will be fetched from the API

  const [eventDetails, setEventDetails] = useState(null);
  const [userId, setUserId] = useState(null); // State to store the userId fetched from the API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    fetch("https://guest-event-app.onrender.com/api/eventdetailsbyuuid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ EventUUID: eventUUID }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status_code === 200 && data.Data.length > 0) {
          setEventDetails(data.Data[0]);
          
          // Fetching userId from the API response
          const fetchedUserId = data.Data[0]?.UserId; // Assuming the API provides userId
          console.log("Fetched UserId:", fetchedUserId);
          
          // Storing userId in state
          setUserId(fetchedUserId);
        } else {
          setError("Failed to fetch event details.");
        }
      })
      .catch((err) => setError("Error fetching event details: " + err.message))
      .finally(() => setLoading(false));
  }, [eventUUID]);

  if (loading) return <Text style={styles.loadingText}>Loading event details...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  const handleCameraPress = () => {
    setMenuVisible(!menuVisible);
  };

  const openCamera = async () => {
    setMenuVisible(false);

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera permission is required to use this feature.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Image captured:", result.assets[0].uri);

      // Handle the captured image, e.g., upload it to your API
      const formData = new FormData();
      formData.append("image", {
        uri: result.assets[0].uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });
      formData.append("EventUUID", eventUUID);
      formData.append("UserId", userId);

      fetch("https://guest-event-app.onrender.com/api/uploadImage", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status_code === 200) {
            Alert.alert("Success", "Image uploaded successfully!");
          } else {
            Alert.alert("Error", "Failed to upload image.");
          }
        })
        .catch((error) => {
          console.error("Upload error:", error);
          Alert.alert("Error", "Something went wrong.");
        });
    }
  };

  const openMediaScreen = () => {
    setMenuVisible(false);
    navigation.navigate("MediaScreen", { eventUUID, userId });
  };

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          {eventDetails?.CoupleImage && (
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: eventDetails.CoupleImage }}
                style={styles.eventImage}
              />
              <TouchableOpacity style={styles.cameraIcon} onPress={handleCameraPress}>
                <Icon name="camera-outline" size={30} color="#FFF" />
              </TouchableOpacity>
              {menuVisible && (
                <View style={styles.menu}>
                  <TouchableOpacity style={styles.menuOption} onPress={openCamera}>
                    <Text style={styles.menuText}>Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuOption} onPress={openMediaScreen}>
                    <Text style={styles.menuText}>Media</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          <Text style={styles.eventName}>{eventDetails?.CoupleName}</Text>

          {/* Event details */}
          <Text style={styles.eventDetails}>
            <Text style={styles.boldText}>Location:</Text> {eventDetails?.EventCity}
          </Text>
          <Text style={styles.eventDetails}>
            <Text style={styles.boldText}>Venue:</Text> {eventDetails?.EventVenue}
          </Text>
          <Text style={styles.eventDetails}>
            <Text style={styles.boldText}>Start Date:</Text>{" "}
            {new Date(eventDetails?.EventStartDate).toLocaleDateString()}
          </Text>
          <Text style={styles.eventDetails}>
            <Text style={styles.boldText}>End Date:</Text>{" "}
            {new Date(eventDetails?.EventEndDate).toLocaleDateString()}
          </Text>
          <Text style={styles.eventDetails}>
            <Text style={styles.boldText}>Organizer:</Text>{" "}
            {eventDetails?.EventOrganizer}
          </Text>

          <TouchableOpacity
            style={styles.rsvpButton}
            onPress={() =>
              navigation.navigate("RSVPScreen", {
                eventUUID: eventDetails?.EventUUID,
              })
            }
          >
            <Text style={styles.buttonText}>RSVP</Text>
          </TouchableOpacity>

          <Text style={styles.eventDescription}>{eventDetails?.EventDetails}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.ViewDetails}
              onPress={() =>
                navigation.navigate("ViewDetails", {
                  eventUUID: eventDetails?.EventUUID,
                })
              }
            >
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ViewDetails}
              onPress={() =>
                navigation.navigate("NextEvent", {
                  eventUUID: eventDetails?.EventUUID,
                })
              }
            >
              <Text style={styles.buttonText}>Event Starts Here</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1, flexDirection: "column", backgroundColor: "transparent" },
  safeArea: { flex: 1 },
  container: { padding: 16, flexGrow: 1 },
  loadingText: { textAlign: "center", marginTop: 20 },
  errorText: { textAlign: "center", color: "red" },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 400,
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  cameraIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 5,
    borderRadius: 15,
  },
  menu: {
    position: "absolute",
    top: 50,
    right: 10,
    backgroundColor: "#FFF",
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  menuOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  menuText: {
    fontSize: 16,
  },
  eventName: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "left",
  },
  eventDetails: { fontSize: 14, marginBottom: 8 },
  boldText: { fontWeight: "bold" },
  eventDescription: {
    fontSize: 16,
    marginTop: 12,
  },
  rsvpButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 5,
    backgroundColor: "#D08A76",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16 },
  buttonContainer: { marginTop: 20 },
  ViewDetails: {
    marginVertical: 10,
    paddingVertical: 12,
    backgroundColor: "#D08A76",
    borderRadius: 10,
    alignItems: "center",
  },
});

export default EventDetails;
