import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

const MediaScreen = ({ route }) => {
  const { userId, eventUUID } = route.params; // Get userId and eventUUID from route params
  const [images, setImages] = useState([]);

  // Fetch images from the server
  const fetchData = async () => {
    try {
      const response = await fetch('https://guest-event-app.onrender.com/api/ImageGalleryList', {
        method: 'POST', // Using POST method 
        headers: {
          'Content-Type': 'application/json', // Specify the content type as JSON
        },
        body: JSON.stringify({ // Sending userId and eventUUID in the request body
          userId: userId,
          eventUUID: eventUUID,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status_code === 200) {
        // Filter images based on EventUUID and UserId
        const filteredImages = data.data
          .flatMap(item => item.Image)
          .filter(image => image.EventUUID === eventUUID && image.UserId === userId);

        setImages(filteredImages); // Set the filtered images in state
      } else {
        console.error('Error fetching images:', data.message);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, eventUUID]); // Re-fetch images if userId or eventUUID changes

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Media Gallery</Text>
      {images.length > 0 ? (
        images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: image.Image }} style={styles.image} />
          </View>
        ))
      ) : (
        <Text>No images available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  imageContainer: {
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});

export default MediaScreen;
