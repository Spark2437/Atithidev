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
} from "react-native";

const { width, height } = Dimensions.get("window");

const MediaScreen = ({ route, navigation }) => {
  const { eventUUID, userId } = route.params;

  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log("Event UUID:", eventUUID);
    console.log("User ID:", userId);
    console.log("Fetching media data...");

    // Fetching media data
    fetch("https://guest-event-app.onrender.com/api/ImageGalleryList", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ EventUUID: eventUUID, UserId: userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        if (data.status_code === 200 && data.data.length > 0) {
          setImageData(data.data);
        } else {
          setError(data.Remark || "No media found for this event.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching media:", err);
        setError("Failed to load media.");
        setLoading(false);
      });
  }, [eventUUID, userId]);

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
                    onPress={() => setSelectedImage(imageItem.Image)}
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

      {/* Full-Screen Image Modal */}
      {selectedImage && (
        <Modal
          visible={!!selectedImage}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedImage(null)}
        >
          <TouchableOpacity
            style={styles.fullScreenContainer}
            onPress={() => setSelectedImage(null)}
          >
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    marginTop: 30,
  },
  scrollView: {
    padding: 20,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryHeading: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAllText: {
    fontSize: 16,
    color: "black",
    fontWeight: "500",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  imageContainer: {
    width: "30%",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
  },

  // Full-Screen Image Modal Styles
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: width,
    height: height,
    backgroundColor: "black",
  },
});

export default MediaScreen;
