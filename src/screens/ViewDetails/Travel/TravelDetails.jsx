import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Button, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const TravelDetails = ({ route }) => {
  const { eventUUID, cardType } = route.params;

  console.log("TravelDetails Screen Loaded");
  console.log("Received Parameters:", { eventUUID, cardType });

  const [travelLinks, setTravelLinks] = useState({});
  const [attractions, setAttractions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data for cardType:", cardType);
        
        if (cardType === "Travel") {
          console.log("Fetching travel links with eventUUID:", eventUUID);
          const travelResponse = await fetch(
            "https://guest-event-app.onrender.com/api/hyperlinkTravel",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ eventUUID }),
            }
          );

          const travelData = await travelResponse.json();
          console.log("Travel Data Fetched:", travelData);
          setTravelLinks(travelData.Data);
        } else if (cardType === "Local Attractions") {
          console.log("Fetching local attractions with eventUUID:", eventUUID);
          const attractionsResponse = await fetch(
            "https://guest-event-app.onrender.com/api/local_attraction",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ eventUUID }),
            }
          );

          const attractionsData = await attractionsResponse.json();
          console.log("Local Attractions Data Fetched:", attractionsData);

          if (attractionsData.status_code === 200) {
            setAttractions(attractionsData.Data || []);
          } else {
            console.error("Failed to fetch attractions:", attractionsData.message);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [eventUUID, cardType]);

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      locations={[0.3, 0.9]}
      style={styles.container}
    >
      <ScrollView>
        {cardType === "Travel" && (
          <View style={styles.travelContainer}>
            {travelLinks.Ola && (
              <View style={styles.travelSection}>
                <Text style={styles.heading}>Ola</Text>
                <Button
                  title="Open Ola"
                  onPress={() => {
                    console.log("Opening Ola URL:", travelLinks.Ola);
                    Linking.openURL(travelLinks.Ola);
                  }}
                />
              </View>
            )}
            {travelLinks.Uber && (
              <View style={styles.travelSection}>
                <Text style={styles.heading}>Uber</Text>
                <Button
                  title="Open Uber"
                  onPress={() => {
                    console.log("Opening Uber URL:", travelLinks.Uber);
                    Linking.openURL(travelLinks.Uber);
                  }}
                />
              </View>
            )}
            {travelLinks.Map && (
              <View style={styles.travelSection}>
                <Text style={styles.heading}>Map</Text>
                <Button
                  title="Open Map"
                  onPress={() => {
                    console.log("Opening Map URL:", travelLinks.Map);
                    Linking.openURL(travelLinks.Map);
                  }}
                />
              </View>
            )}
          </View>
        )}
        {cardType === "Local Attractions" && (
          <View style={styles.attractionsContainer}>
            <Text style={styles.heading}>Local Attractions</Text>
            {attractions.length > 0 ? (
              attractions.map((attraction, index) => {
                console.log("Rendering Attraction:", attraction);
                return (
                  <View key={index} style={styles.attractionCard}>
                    <Text style={styles.attractionName}>{attraction.name}</Text>
                    <Text>{attraction.description}</Text>
                    {attraction.maps_link && (
                      <Button
                        title="View on Map"
                        onPress={() => {
                          console.log("Opening Attraction Map Link:", attraction.maps_link);
                          Linking.openURL(attraction.maps_link);
                        }}
                      />
                    )}
                  </View>
                );
              })
            ) : (
              <Text style={styles.noDataText}>No attractions available.</Text>
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
    padding: 16,
  },
  travelContainer: {
    marginVertical: 16,
  },
  travelSection: {
    marginBottom: 16,
  },
  attractionsContainer: {
    marginVertical: 16,
  },
  attractionCard: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  attractionName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
  },
});

export default TravelDetails;
