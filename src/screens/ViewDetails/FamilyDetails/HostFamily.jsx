import * as React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

function HostFamily({ route, navigation }) {

  const { eventUUID, UserId } = route.params;
  console.log("Event UUID:", eventUUID);

  const openCamera = async () => {
    try {
      console.log("Requesting camera permissions...");
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        console.log("Camera permission denied.");
        Alert.alert("Permission Denied", "Camera permission is required to use this feature.");
        return;
      }

      console.log("Camera permission granted.");
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
        console.log("File name:", fileName, "File extension:", fileExtension);

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
        console.log("Mime type determined:", mimeType);

        formData.append("Image", {
          uri: uri,
          name: fileName,
          type: mimeType,
        });

        console.log("FormData prepared:", formData);

        const response = await fetch("https://guest-event-app.onrender.com/api/ImagebyUserInsert", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });

        const data = await response.json();
        console.log("Upload response:", data);

        if (data.status_code === 200) {
          Alert.alert("Success", "Image uploaded successfully!");
          console.log("Uploaded Data:", data.Data);
        } else {
          Alert.alert("Error", data.message || "Failed to upload image.");
          console.error("Upload error:", data.message);
        }
      } else {
        console.log("Camera was closed without taking a photo.");
      }
    } catch (error) {
      console.error("Error launching camera:", error);
      Alert.alert("Error", "Unable to open the camera.");
    }
  };

  const fetchFamilyDetails = async (side) => {
    try {
      console.log(`Fetching details for ${side} family...`);
      const response = await fetch('https://guest-event-app.onrender.com/api/Familydetailsbyuuid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          EventUUID: eventUUID,
          Side: side,
        }),
      });

      const data = await response.json();
      console.log("Family details response:", data);

      if (data.status_code === 200) {
        console.log(`Navigating to ${side}FamilyDetails`);
        navigation.navigate(side + "FamilyDetails", {
          familyDetails: data,
          eventUUID: eventUUID,
          side: side,
        });
      } else {
        console.error("Error fetching data:", data.Remark);
      }
    } catch (error) {
      console.error("API request failed:", error);
    }
  };

  return (
    <LinearGradient
      colors={['rgba(232, 198, 188, 0.8)', 'rgba(146, 101, 89, 0.5)']} 
      locations={[0.3, 0.9]}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        {/* Groom Family Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => fetchFamilyDetails("Groom")}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: "https://plus.unsplash.com/premium_photo-1682090840373-b06b5237ae74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFtaWx5JTIwd2VkZGluZyUyMGluZGlhbnxlbnwwfDB8MHx8fDA%3D",
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Groom Family</Text>
            <Text style={styles.description}>Get to know the Groom's Family, and some Fun Facts About Them.</Text>
          </View>
        </TouchableOpacity>

        {/* Bride Family Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => fetchFamilyDetails("Bride")}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: "https://plus.unsplash.com/premium_photo-1729038880168-b9123602b10b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFtaWx5JTIwd2VkZGluZyUyMGluZGlhbnxlbnwwfDB8MHx8fDA%3D",
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Bride Family</Text>
            <Text style={styles.description}>Get to know the Bride's Family, and some Fun Facts About Them.</Text>
          </View>
        </TouchableOpacity>

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
    </LinearGradient>
  );
}

export default HostFamily;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1, 
  },
  container: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center", 
    padding: 16,
  },
  card: {
    width: "90%", 
    maxWidth: 350, 
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
    overflow: "hidden", 
  },
  imageContainer: {
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", 
  },
  textContainer: {
    padding: 10,
    justifyContent: "center", 
    alignItems: "center", 
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center", 
  },
  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center", 
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly", 
    backgroundColor: "#D08A76",
    paddingVertical: 10,
    position: "absolute", 
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
});
