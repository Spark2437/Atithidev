import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

const ViewDetails = ({ route }) => {
  const navigation = useNavigation();
  const { eventUUID, UserId } = route.params;

  // Function to open camera
  const openCamera = async () => {
    try {
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

        fetch("https://guest-event-app.onrender.com/api/ImagebyUserInsert", {
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
              Alert.alert("Error", data.message || "Failed to upload image.");
            }
          })
          .catch((error) => {
            Alert.alert("Error", "Something went wrong.");
          });
      }
    } catch (error) {
      Alert.alert("Error", "Unable to open the camera.");
    }
  };

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      locations={[0.3, 0.9]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Card 1: Host Family */}
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("HostFamily", { eventUUID, UserId })
            }
          >
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOOezK-E_vTwniW-dKkVxXGlhQYo0jE3kqCQ&s",
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Host Family</Text>
              <Text style={styles.description}>
                Information about the bride and groom's families.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Card 2: Event Schedule */}
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("EventSchedule", { eventUUID, UserId })
            }
          >
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: "https://shaandaarevents.com/wp-content/uploads/2023/11/377680-jpg.webp",
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Event Schedule</Text>
              <Text style={styles.description}>
                Detailed schedule for all wedding events.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Card 3: Travel and Local Attractions */}
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Travel", { eventUUID, UserId })
            }
          >
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: "https://travellerkaka.com/wp-content/uploads/2024/06/Top-10-Must-Visit-Destinations-in-North-India.png",
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Travel and Local Attractions</Text>
              <Text style={styles.description}>
                Accommodation details for guests attending the wedding.
              </Text>
            </View>
          </TouchableOpacity>
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
  container: {
    flex: 1,
    padding: 16,
    marginTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#E0E0E0",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
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
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontFamily: "PTSans_400Regular",
  },
  footer: {
    position: "absolute", 
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#D08A76",
    paddingVertical: 10,
  },
  footerButton: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ViewDetails;

