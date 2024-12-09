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
  const { eventUUID } = route.params;

  const [eventDetails, setEventDetails] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching event details for EventUUID:", eventUUID);
    fetch("https://guest-event-app.onrender.com/api/eventdetailsbyuuid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ EventUUID: eventUUID }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Received data:", data);
        if (data.status_code === 200 && data.Data.length > 0) {
          setEventDetails(data.Data[0]);
          const fetchedUserId = data.Data[0]?.UserId;
          console.log("Fetched UserId:", fetchedUserId);
          setUserId(fetchedUserId);
        } else {
          setError("Failed to fetch event details.");
          console.error("Error fetching event details:", data.Remark);
        }
      })
      .catch((err) => {
        setError("Error fetching event details: " + err.message);
        console.error("Fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, [eventUUID]);

  if (loading) return <Text style={styles.loadingText}>Loading event details...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  const openCamera = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Camera permission is required to use this feature.");
        return;
      }

      // Launch the camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Image,
        quality: 1,
      });

      if (!result.canceled) {
        console.log("Image captured:", result.assets[0].uri);

        // Prepare FormData for the API request
        const formData = new FormData();
        formData.append("EventUUID", eventUUID); // Add EventUUID
        formData.append("UserId", userId); // Add UserId

        // Determine the MIME type based on file extension or provide a default
        const uri = result.assets[0].uri;
        const fileName = uri.split('/').pop();
        const fileExtension = fileName.split('.').pop().toLowerCase();
        
        let mimeType;
        switch (fileExtension) {
          case 'jpg':
          case 'jpeg':
            mimeType = 'image/jpeg';
            break;
          case 'png':
            mimeType = 'image/png';
            break;
          case 'gif':
            mimeType = 'image/gif';
            break;
          case 'bmp':
            mimeType = 'image/bmp';
            break;
          case 'webp':
            mimeType = 'image/webp';
            break;
          default:
            mimeType = 'application/octet-stream'; 
            break;
        }

        formData.append("Image", {
          uri: uri,
          name: fileName,
          type: mimeType,
        });

        console.log("FormData prepared:", formData);

        fetch("https://guest-event-app.onrender.com/api/ImagebyUserInsert", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Upload response:", data);
            if (data.status_code === 200) {
              Alert.alert("Success", "Image uploaded successfully!");
              console.log("Uploaded Data:", data.Data); 
            } else {
              Alert.alert("Error", data.message || "Failed to upload image.");
              console.error("Upload error:", data.message);
            }
          })
          .catch((error) => {
            console.error("Upload error:", error);
            Alert.alert("Error", "Something went wrong.");
          });
      } else {
        console.log("Camera was closed without taking a photo.");
      }
    } catch (error) {
      console.error("Error launching camera:", error);
      Alert.alert("Error", "Unable to open the camera.");
    }
  };

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainContainer}>
          <ScrollView contentContainerStyle={styles.container}>
            {eventDetails?.EventImage && (
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: eventDetails.EventImage}}
                  style={styles.eventImage}
                />
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

          {/* Footer */}
          <View style={styles.footer}>
          
            <TouchableOpacity style={styles.footerButton} onPress={openCamera}>
              <Icon name="camera-outline" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => navigation.navigate("MediaScreen", { eventUUID, userId })}
            >
              <Icon name="images-outline" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => navigation.navigate("Vendors", { eventUUID })}
            >
              <Icon name="business-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1, backgroundColor: "transparent" },
  safeArea: { flex: 1 },
  mainContainer: { flex: 1, flexDirection: "column" },
  container: { padding: 16, paddingBottom: 100 },
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
    borderRadius: 10,
    overflow: 'hidden',
    resizeMode: 'cover',
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
    marginBottom :20,
   },
   rsvpButton:{
     alignSelf:"flex-start",
     paddingVertical :10,
     paddingHorizontal :15,
     marginTop :5,
     backgroundColor:"#D08A76",
     borderRadius :10,
     alignItems:"center",
   },
   buttonContainer:{
     marginTop :20,
   },
   buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF', 
  },
   ViewDetails:{
     marginVertical :10,
     paddingVertical :12,
     backgroundColor:"#D08A76",
     borderRadius :10,
     alignItems:"center"
   },

   // Footer 
   footer:{
     flexDirection:"row",
     justifyContent:"space-around",
     backgroundColor:"#D08A76",
     paddingVertical :10,
     position:"absolute",
     bottom :0,
     left :0,
     right :0
   },
   footerButton:{
     alignItems:"center"
   },
});

export default EventDetails;