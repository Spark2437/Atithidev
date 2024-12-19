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
  const { eventUUID, UserId } = route.params;
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [circleImage, setCircleImage] = useState(null);

  const [username, setUsername] = useState("");

  useEffect(() => {
    console.log("Fetching event details for EventUUID:", eventUUID);

    // Fetch event details
    fetch("https://guest-event-app.onrender.com/api/eventdetailsbyuuid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ EventUUID: eventUUID }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Received event data:", data);
        if (data.status_code === 200 && data.Data.length > 0) {
          setEventDetails(data.Data[0]);
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

    // Fetch circle image
    fetch("https://guest-event-app.onrender.com/api/StoryMainIcon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ EventUUID: eventUUID }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status_code === 200 && data.Data?.Image) {
          setCircleImage(data.Data.Image);
        } else {
          console.error("Error fetching circle image:", data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching circle image:", err);
      });

    // Fetch profile data

    setusername();
  }, [eventUUID]);

 

  const setusername = () => {
    fetch("https://guest-event-app.onrender.com/api/Userdetailsbyuuid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ UserId: UserId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status_code === 200 && data.Data.length > 0) {
          setUsername(data.Data[0].Username); // Set the username
        } else {
          console.error("Error fetching username:", data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching username:", err);
      });
  };


  const openCamera = async () => {
    try {
      console.log("Requesting camera permissions...");
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Camera permission is required to use this feature.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Image,
        quality: 1,
      });

      if (!result.canceled) {
        console.log("Image captured:", result.assets[0].uri);

        const formData = new FormData();
        formData.append("EventUUID", eventUUID);
        formData.append("UserId", UserId);

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

  

  if (loading) return <Text style={styles.loadingText}>Loading event details...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

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
                  source={{ uri: eventDetails.EventImage }}
                  style={styles.eventImage}
                />


              </View>
            )}
            <Text style={styles.eventName}>{eventDetails?.CoupleName}</Text>

            <View style={styles.detailsContainer}>
              {circleImage && (
                <TouchableOpacity
                  style={styles.circleButton}
                  onPress={() => {
                    console.log("Navigating to OurStory with eventUUID:", eventUUID);
                    navigation.navigate("OurStory", { eventUUID });
                  }}
                >
                  <Image source={{ uri: circleImage }} style={styles.circleImage} />
                </TouchableOpacity>
              )}
              <View style={styles.eventDetailsContainer}>
                <Text style={styles.eventDetails}>
                  <Text style={styles.boldText}>Location:</Text> {eventDetails?.EventCity}
                </Text>
                <Text style={styles.eventDetails}>
                  <Text style={styles.boldText}>Venue:</Text> {eventDetails?.EventVenue}
                </Text>
                <Text style={styles.eventDetails}>
                  <Text style={styles.boldText}>Date:</Text>
                  {new Date(eventDetails?.EventStartDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long' })}
                </Text>
                <Text style={styles.eventDetails}>
                  <Text style={styles.boldText}>Time:</Text>
                  {new Date(eventDetails?.EventStartDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </Text>

                <Text style={styles.eventDetails}>
                  <Text style={styles.boldText}>Organizer:</Text>{" "}
                  {eventDetails?.EventOrganizer}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.rsvpButton}
              onPress={() => {
                console.log("Navigating to RSVP Screen with eventUUID:", eventDetails?.EventUUID);
                navigation.navigate("RSVPScreen", {
                  eventUUID: eventDetails?.EventUUID,
                  UserId: UserId,
                });
              }}
            >
              <Text style={styles.buttonText}>RSVP</Text>
            </TouchableOpacity>

            <Text style={styles.eventName}>About</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.couple}
               /* onPress={() => {
                  console.log("Navigating to RSVP Screen with eventUUID:", eventDetails?.EventUUID);
                  navigation.navigate("RSVPScreen", {
                    eventUUID: eventDetails?.EventUUID,
                    UserId: UserId,
                  });
                }} */
              >
                <Text style={styles.buttonText}>Groom</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.couple}
                /* onPress={() => {
                  console.log("Navigating to RSVP Screen with eventUUID:", eventDetails?.EventUUID);
                  navigation.navigate("RSVPScreen", {
                    eventUUID: eventDetails?.EventUUID,
                    UserId: UserId,
                  });
                }} */
              >
                <Text style={styles.buttonText}>Bride</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.eventDescriptionContainer}>
              <Text style={styles.eventDescription}>
                Dear {username} Ji,{"\n"}{eventDetails?.EventDetails}
              </Text>
            </View>


            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.ViewDetails}
                onPress={() => {
                  console.log("Navigating to ViewDetails with eventUUID:", eventDetails?.EventUUID, "and UserId:", UserId);
                  navigation.navigate("ViewDetails", {
                    eventUUID: eventDetails?.EventUUID,
                    UserId: UserId,
                  });
                }}
              >
                <Text style={styles.buttonText}>View Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.ViewDetails}
                onPress={() => {
                  console.log("Navigating to NextEvent with eventUUID:", eventDetails?.EventUUID, "and UserId:", UserId);
                  navigation.navigate("NextEvent", {
                    eventUUID: eventDetails?.EventUUID,
                    UserId: UserId,
                  });
                }}
              >
                <Text style={styles.buttonText}>Event Starts Here</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => {
                console.log("Navigating to EventDetails with eventUUID:", eventUUID);
                navigation.navigate("EventDetails", { eventUUID, UserId });
              }}
            >
              <Icon name="home-outline" size={24} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerButton} onPress={openCamera}>
              <Icon name="camera-outline" size={24} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => {
                console.log("Navigating to MediaScreen with eventUUID and UserId:", eventUUID, UserId);
                navigation.navigate("MediaScreen", { eventUUID, UserId });
              }}
            >
              <Icon name="images-outline" size={24} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => {
                console.log("Navigating to Vendors with eventUUID:", eventUUID);
                navigation.navigate("Vendors", { eventUUID, UserId });
              }}
            >
              <Icon name="business-outline" size={24} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => {
                console.log("Navigating to ProfileScreen with eventUUID and UserId:", eventUUID, UserId);
                navigation.navigate("ProfileScreen", { UserId, eventUUID });
              }}
            >
              <Icon name="person-outline" size={24} color="#FFF" />
            </TouchableOpacity>

          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  safeArea: { flex: 1 },
  mainContainer: { flex: 1 },
  container: { padding: 16 },
  loadingText: { textAlign: "center", marginTop: 20 },
  errorText: { textAlign: "center", color: "red" },

  imageWrapper: {
    width: "100%",
    height: 400,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },

  eventImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  eventName: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "left",
  },

  eventDetails: { fontSize: 14, marginBottom: 8 },
  boldText: { fontWeight: "bold" },

  rsvpButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#D08A76",
    borderRadius: 10,
    alignItems: "center",
  },

  eventDescriptionContainer: {
    marginTop: 10,
  },

  eventDescription: {
    fontSize: 16,
    marginBottom: 5,
  },

  buttonContainer: {

  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },

  ViewDetails: {
    marginVertical: 10,
    paddingVertical: 12,
    backgroundColor: "#D08A76",
    borderRadius: 10,
    alignItems: "center",
  },
  


  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#D08A76",
    paddingVertical: 10,
  },

  footerButton: {
    alignItems: "center",
  },

  circleButton: {
    position: "absolute",
    right: 5,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#ff4500",
    backgroundColor: "#000",
    zIndex: 10,
  },

  circleImage: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
    resizeMode: "cover",
  },

ofileTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profileDetails: {
    fontSize: 16,
    marginBottom: 5,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
   
    
  },

  couple: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: "#D08A76",
    borderRadius: 10,
    alignItems: "center",
  }, 

  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#D08A76",
    borderRadius: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default EventDetails;
