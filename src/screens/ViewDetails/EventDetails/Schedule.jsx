import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Schedule = ({ route }) => {
  const { eventUUID, subEventUUID } = route.params;
  const [subEventDetails, setSubEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLink, setMapLink] = useState(null); // For storing map link

  useEffect(() => {
    const fetchSubEventDetails = async () => {
      try {
        const response = await fetch(
          "https://guest-event-app.onrender.com/api/SubEventsdetailsbysubuuid",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ SubEventUUID: subEventUUID }),
          }
        );

        const data = await response.json();
        if (data.status_code === 200 && data.Data) {
          setSubEventDetails(data.Data[0]);
          fetchEventMapLink(data.Data[0].EventUUID); // Fetch map link using eventUUID
        } else {
          setError("No details found for this sub-event.");
        }
      } catch (err) {
        setError("Error fetching sub-event details: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchEventMapLink = async (eventUUID) => {
      try {
        const response = await fetch(
          "https://guest-event-app.onrender.com/api/EventMapLink",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ EventUUID: eventUUID }),
          }
        );

        const mapData = await response.json();

        if (mapData.status_code === 200 && mapData.Data) {
          setMapLink(mapData.Data.EventMapLink); // Store map link from response
        } else {
          setMapLink(null); // Handle case where no map link is returned
        }
      } catch (err) {
        setMapLink(null); // Handle errors when fetching map link
      }
    };

    fetchSubEventDetails();
  }, [subEventUUID]);

  return (
    <LinearGradient
      colors={['rgba(232, 198, 188, 0.8)', 'rgba(146, 101, 89, 0.5)']}
      locations={[0.3, 0.9]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : (
          <View style={styles.detailsContainer}>
            {/* Sub-event image */}
            <Image source={{ uri: subEventDetails.Image }} style={styles.image} />

            {/* Event Name */}
            <Text style={styles.title}>{subEventDetails.EventName}</Text>

            {/* Event Date */}
            <Text style={styles.date}>
              Date: {new Date(subEventDetails.DateandTime).toLocaleDateString()}
            </Text>

            {/* Sub-event Description */}
            <Text style={styles.description}>{subEventDetails.ShortDescription}</Text>

            {/* Location Image */}
            <Image source={{ uri: subEventDetails.LocationImage }} style={styles.locationImage} />

            {/* Event Location */}
            <Text style={styles.location}>Location: {subEventDetails.Placeinvenue}</Text>

            {/* Displaying Map Link */}
            {mapLink && (
              <View style={styles.mapContainer}>
                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={() => Linking.openURL(mapLink)} // Opens the map link in the browser or app
                >
                  <Text style={styles.mapButtonText}>View on Map</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 0,
  },
  image: {
    width: '100%',
    height: 400, // Increased image size
    resizeMode: 'cover',
    borderRadius: 10, // Optional, if you want to add rounded corners to the image
  },
  locationImage: {
    width: '100%',
    height: 200, // Adjust as needed
    resizeMode: 'cover',
    marginTop: 15, // Add space between images
    borderRadius: 10, // Optional for rounded corners
  },
  detailsContainer: {
    padding: 20,
    marginTop: 10,
    flex: 1, // Ensures it takes up the full available space
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 15,
    color: 'black',
  },
  date: {
    fontSize: 16,
    color: 'black',
  },
  location: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    color: 'black',
  },
  mapContainer: {
    marginTop: 20,
    flexDirection: 'row', // This aligns the button horizontally if needed
    justifyContent: 'center', // Centers the button
  },
  mapButton: {
    paddingVertical: 12,
    marginBottom: 10,
    backgroundColor: "#D08A76",
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
  },
  mapButtonText: {
    color: 'white', // White text color
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Schedule;
