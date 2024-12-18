import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

const EventSchedule = ({ route }) => {
  const { eventUUID, UserId } = route.params;
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

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      locations={[0.3, 0.9]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
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
                  <Text style={styles.subEventDate}>
                    {new Date(subEvent.DateandTime).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                    })}
                  </Text>
                  <Text style={styles.subEventTime}>
                    {new Date(subEvent.DateandTime).toLocaleString("en-US",{
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
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

        {/* Footer */}
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
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingBottom: 30,
  },
  scheduleList: {
    flexGrow: 1,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  scheduleCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  subEventImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  scheduleDetails: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  subEventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  subEventDate: {
    fontSize: 14,
    color: "black",
    marginBottom: 4,
  },
  subEventTime: {
    fontSize: 14,
    color: "black",
    marginBottom: 4,
  },
  subEventLocation: {
    fontSize: 14,
    color: "black",
    marginBottom: 8,
  },
  errorText: {
    color: "black",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#D08A76",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  footerButton: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default EventSchedule;
