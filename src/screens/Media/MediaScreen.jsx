import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";

const { width, height } = Dimensions.get("window");

const MediaScreen = ({ route, navigation }) => {
  const { eventUUID, UserId } = route.params;

  const [imageData, setImageData] = useState([]);
  const [storiesData, setStoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  // Fetch image gallery
  useEffect(() => {
    fetch("https://guest-event-app.onrender.com/api/ImageGalleryList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ EventUUID: eventUUID, UserId: UserId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status_code === 200 && data.data.length > 0) {
          setImageData(data.data);
        } else {
          setError(data.Remark || "No media found for this event.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load media.");
        setLoading(false);
      });
  }, [eventUUID, UserId]);

  // Fetch stories
  useEffect(() => {
    fetch("https://guest-event-app.onrender.com/api/UserStoriesList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ EventUUID: eventUUID, UserId: UserId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status_code === 200 && data.data.length > 0) {
          const storiesWithViewedStatus = data.data.map((story) => ({
            ...story,
            viewed: false, // Add a viewed property to each story
          }));
          setStoriesData(storiesWithViewedStatus);
        }
      })
      .catch(() => {
        console.log("Error fetching stories.");
      });
  }, [eventUUID, UserId]);

  const handleViewStory = (story) => {
    setSelectedStory(story.Image[0]?.Image);

    // Mark story as viewed
    setStoriesData((prevStories) =>
      prevStories.map((item) =>
        item === story ? { ...item, viewed: true } : item
      )
    );
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
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* Stories Section */}
          <View style={styles.storiesContainer}>
            <Text style={styles.storiesHeading}>Stories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {storiesData.map((story, index) => (
                <View key={index} style={styles.storyCircleContainer}>
                  <TouchableOpacity onPress={() => handleViewStory(story)}>
                    <View
                      style={[
                        styles.storyCircle,
                        story.viewed && styles.storyViewedCircle,
                      ]}
                    >
                      <Image
                        source={{ uri: story.Image[0]?.Image }}
                        style={styles.storyImage}
                        resizeMode="cover"
                      />
                    </View>
                  </TouchableOpacity>
                  {/* Display user name below the story */}
                  <Text style={styles.storyUserName}>{story.Category}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Categories Section */}
          {imageData.map((category, index) => (
            <View key={index} style={styles.categoryContainer}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryHeading}>{category.Category}</Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("CategoryImages", {
                      category: category.Category,
                      images: category.Image,
                    })
                  }
                >
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.gridContainer}>
                {category.Image.slice(0, 6).map((imageItem, imgIndex) => (
                  <View key={imgIndex} style={styles.imageContainer}>
                    <TouchableOpacity
                      onPress={() => setSelectedStory(imageItem.Image)}
                    >
                      <Image
                        source={{ uri: imageItem.Image }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Full-Screen Story Modal */}
        {selectedStory && (
          <Modal
            visible={!!selectedStory}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setSelectedStory(null)}
          >
            <TouchableOpacity
              style={styles.fullScreenContainer}
              onPress={() => setSelectedStory(null)}
            >
              <Image
                source={{ uri: selectedStory }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Modal>
        )}


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
  gradientContainer: { flex: 1 },
  container: { flex: 1, backgroundColor: "#f4f4f4", marginTop: 30 },
  scrollView: { padding: 20 },

  // Stories Section Styles
  storiesContainer: { marginBottom: 20 },
  storiesHeading: { fontSize: 20,  marginBottom: 10 , fontFamily: "Poppins_400Regular" },
  storyCircleContainer: { alignItems: "center", marginRight: 15 },
  storyCircle: { borderWidth: 3, borderColor: "#ff4500", borderRadius: 40, padding: 3 },
  storyViewedCircle: { borderColor: "#ccc" },
  storyImage: { width: 70, height: 70, borderRadius: 35 },
  storyUserName: { marginTop: 5, fontSize: 14,  textAlign: "center", color: "#333" ,fontFamily: "PTSans_400Regular", },

  // Categories Section Styles
  categoryContainer: { marginBottom: 20 },
  categoryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" , },
  categoryHeading: { fontSize: 18, fontFamily: "Poppins_400Regular" },
  seeAllText: { fontSize: 16, color: "black", fontFamily: "PTSans_400Regular" },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 10 },
  imageContainer: { width: "30%", marginBottom: 10 },
  image: { width: "100%", aspectRatio: 1, borderRadius: 8 },

  // Full-Screen Story Modal Styles
  fullScreenContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" },
  fullScreenImage: { width: width, height: height },

  // Footer Styles
  footer: { flexDirection: "row", justifyContent: "space-around", backgroundColor: "#D08A76", paddingVertical: 10 },
  footerButton: { alignItems: "center" },
});

export default MediaScreen;
