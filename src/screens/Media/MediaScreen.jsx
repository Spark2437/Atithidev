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
  // Stories Section Styles
  storiesContainer: {
    marginBottom: 20,
  },
  storiesHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  storyCircleContainer: {
    alignItems: "center",
    marginRight: 15,
  },
  storyCircle: {
    borderWidth: 3,
    borderColor: "#ff4500", // Highlight color for unviewed story
    borderRadius: 40,
    padding: 3,
  },
  storyViewedCircle: {
    borderColor: "#ccc", // Muted color for viewed story
  },
  storyImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  storyUserName: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    color: "#333",
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

  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  fullScreenImage: {
    width: width,
    height: height,
  },
});

export default MediaScreen;
