import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient

const TravelDetails = ({ route }) => {
  const { details } = route.params; // Get the details passed from the Travel screen

  return (
    <LinearGradient
    colors={['rgba(232, 198, 188, 0.8)', 'rgba(146, 101, 89, 0.5)']}
    locations={[0.3, 0.9]}
      style={styles.container}
    >
      <ScrollView>
        {/* Image at the top */}
        {details.imageUri && (
          <Image source={{ uri: details.imageUri }} style={styles.image} />
        )}

        <View style={styles.textContainer}>
          {/* Title and Location */}
          <Text style={styles.title}>{details.title}</Text>
          <Text style={styles.location}>{details.location}</Text>

          {/* Description */}
          <Text style={styles.description}>
            This is the description of the place or event. Feel free to add more
            details about what you can do, experience, or any extra information
            that could be useful for the user.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  image: {
    width: "100%", // Full width of the screen
    height: 250, // Set an appropriate height for the image
    resizeMode: "cover", // Ensure the image covers the area properly
  },
  textContainer: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black", // White color for better contrast on dark background
    textAlign: "left", // Ensure the title aligns to the left
  },
  location: {
    fontSize: 20,
    color: "black", // Lighter color for the location text
    marginVertical: 10,
    textAlign: "left", // Ensure the location text aligns to the left
  },
  description: {
    fontSize: 16,
    color: "black", // Light color for the description
    marginVertical: 15,
    lineHeight: 22, // For better readability
    textAlign: "left", // Ensure description starts from the left
  },
});

export default TravelDetails;
