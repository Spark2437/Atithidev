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
import { useUser } from "../../contexts/UserContext"; 

const MediaScreen = ({ route, navigation }) => {
  const { eventUUID } = route.params; // Getting eventUUID from route params
  const { userId } = useUser(); // Get userId from context

  const [imageData, setImageData] = useState([]); // State to store image categories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Event UUID:", eventUUID);
    console.log("User ID:", userId); // userId from context
  
    console.log("Fetching media data...");
    // Fetching media data (images grouped by category) based on eventUUID and userId
    fetch("https://guest-event-app.onrender.com/api/ImageGalleryList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ EventUUID: eventUUID, UserID: [userId] }), // Sending userId as an array
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data); // Log the fetched data
        if (data.status_code === 200 && data.data.length > 0) {
          setImageData(data.data); // Assuming data.data contains categories of images
          setLoading(false);
        } else {
          setError(data.Remark || "No media found for this event.");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("Error fetching media:", err); // Log any errors
        setError("Failed to load media.");
        setLoading(false);
      });
  }, [eventUUID, userId]); // Dependency array to trigger effect when eventUUID or userId changes
  
  // Function to handle image picking
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Image picked:", result.uri); // Log the selected image URI
      Alert.alert("Image picked", `You selected: ${result.uri}`);
    } else {
      console.log("Image picking canceled"); // Log if the image picking was canceled
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading media...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <LinearGradient
          colors={["#00c6ff", "#0072ff"]}
          style={styles.gradient}
        >
          <Text style={styles.heading}>Media</Text>
        </LinearGradient>

        <Text style={styles.userInfo}>User ID: {userId}</Text> {/* Displaying the userID from context */}

        <TouchableOpacity
          style={styles.pickImageButton}
          onPress={pickImage}
        >
          <Icon name="camera" size={30} color="#fff" />
          <Text style={styles.pickImageText}>Pick an image</Text>
        </TouchableOpacity>

        {imageData.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <Text style={styles.categoryHeading}>{category.Category}</Text> {/* Display the category name */}

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {category.Image.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image
                    source={{ uri: image.Image }} // Using the image URL from the data
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  scrollView: {
    padding: 10,
  },
  gradient: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    marginBottom: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  userInfo: {
    fontSize: 16,
    color: "#333",
    marginVertical: 10,
    textAlign: "center",
  },
  pickImageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0072ff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  pickImageText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 16,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
});

export default MediaScreen;
