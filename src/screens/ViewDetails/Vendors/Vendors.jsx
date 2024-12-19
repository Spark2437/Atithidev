import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

const Vendors = ({ route, navigation }) => {
  const [vendorsData, setVendorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { eventUUID, UserId } = route.params;

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await fetch(
          "https://guest-event-app.onrender.com/api/VendorDetailsbyuuid",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ EventUUID: eventUUID }),
          }
        );

        const data = await response.json();

        if (data.status_code === 200) {
          const filteredVendors = data.Data.filter((category) =>
            category.Image.some((vendor) => vendor.EventUUID === eventUUID)
          );
          setVendorsData(filteredVendors);
        } else {
          console.error("API request failed:", data.Remark);
        }
      } catch (error) {
        console.error("Error fetching vendor data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [eventUUID]);

  const handleVendorClick = (vendorUUID) => {
    navigation.navigate("VendorDetails", { vendorUUID, eventUUID });
  };

  const renderVendorItem = ({ item }) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{item.Category}</Text>
      <FlatList
        data={item.Image}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleVendorClick(item.VendorUUID)}
            style={styles.card}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.VendorImage }} style={styles.image} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.VendorName}</Text>
              <Text style={styles.description}>{item.VendorType}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(vendor) => vendor.VendorUUID}
        horizontal
      />
    </View>
  );


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
        const fileName = uri.split("/").pop();
        const fileExtension = fileName.split(".").pop().toLowerCase();

        let mimeType;
        switch (fileExtension) {
          case "jpg":
          case "jpeg":
            mimeType = "image/jpeg";
            break;
          case "png":
            mimeType = "image/png";
            break;
          case "gif":
            mimeType = "image/gif";
            break;
          case "bmp":
            mimeType = "image/bmp";
            break;
          case "webp":
            mimeType = "image/webp";
            break;
          default:
            mimeType = "application/octet-stream";
            break;
        }

        formData.append("Image", {
          uri: uri,
          name: fileName,
          type: mimeType,
        });

        setLoading(true);

        fetch("https://guest-event-app.onrender.com/api/ImagebyUserInsert", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            setLoading(false);
            console.log("Upload response:", data);
            if (data.status_code === 200) {
              Alert.alert("Success", "Image uploaded successfully!");
            } else {
              Alert.alert("Error", data.message || "Failed to upload image.");
            }
          })
          .catch((error) => {
            setLoading(false);
            console.error("Upload error:", error);
            Alert.alert("Error", "Something went wrong.");
          });
      } else {
        console.log("Camera was closed without taking a photo.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error launching camera:", error);
      Alert.alert("Error", "Unable to open the camera.");
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
        locations={[0.3, 0.9]}
        style={styles.gradientContainer}
      >
        <View style={styles.loaderContainer}>
          <Text>Loading vendors...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (vendorsData.length === 0) {
    return (
      <LinearGradient
        colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
        locations={[0.3, 0.9]}
        style={styles.gradientContainer}
      >
        <View style={styles.loaderContainer}>
          <Text>No vendors available for this event.</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      locations={[0.3, 0.9]}
      style={styles.gradientContainer}
    >
      <FlatList
        contentContainerStyle={styles.container}
        data={vendorsData}
        renderItem={renderVendorItem}
        keyExtractor={(category) => category.Category}
      />

      {/* Footer with Camera Button */}
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

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    marginTop: 30,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontFamily: "Baskervville_400Regular",
    marginBottom: 10,
    color: "#333",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginRight: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    fontFamily: "PTSans_400Regular"
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
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
});

export default Vendors;
