import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

const Travel = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventUUID, UserId } = route.params || {};

  const [loading, setLoading] = useState(false);

  const details = [
    {
      title: "Travel",
      description: "Explore various destinations",
      amenities: "Guided tours, Transportation",
      imageUri: "https://newsroom.aaa.com/wp-content/uploads/2023/10/iStock-816320512-1024x453.jpg",
      cardType: "Travel",
    },
    {
      title: "Local Attractions",
      description: "Explore nearby places",
      amenities: "Museums, Parks, Historical Sites",
      imageUri: "https://entrepreneuronemedia.com/wp-content/uploads/2022/04/blog-cover1.jpg",
      cardType: "Local Attractions",
    },
  ];

  const handleCardPress = (item) => {
    console.log("Card Pressed:", item);
    navigation.navigate("TravelDetails", { eventUUID, cardType: item.cardType });
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
              console.error("Upload error:", data.message);
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

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      locations={[0.3, 0.9]}
      style={styles.container}
    >
      <ScrollView>
        {details.map((item, index) => {
          return (
            <TouchableOpacity key={index} onPress={() => handleCardPress(item)}>
              <View style={styles.card}>
                <Image source={{ uri: item.imageUri }} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.amenities}>{item.amenities}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
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
          
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "rgba(232, 198, 188, 0.8)",
  },
  card: {
    flex: 1,
    flexDirection: "column", 
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    marginVertical: 10, 
    overflow: "hidden",
    marginTop:30, 
  },
  image: {
    width: "100%", 
    height: 150,
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center", 
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_400Regular",
    color: "#333",
    marginBottom: 5, 
  },
  description: {
    fontSize: 14,
    color: "#555",
    fontFamily: "PTSans_400Regular",
    marginBottom: 5, 
  },
  amenities: {
    fontSize: 14,
    color: "#555",
    fontFamily: "PTSans_400Regular",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center", 
    backgroundColor: "#D08A76",
    paddingVertical: 10,
    paddingHorizontal: 20, 
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1, 
  },
});


export default Travel;
