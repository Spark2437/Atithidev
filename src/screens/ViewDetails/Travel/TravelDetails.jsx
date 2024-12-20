import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Linking, TouchableOpacity } from "react-native";
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
          const attractionsData = {
            "status_code": 200,
            "status": "Success",
            "Data": [
                {
                    "name": "Jantar Mantar, Jaipur",
                    "type": "attraction",
                    "maps_link": "https://www.google.com/maps?q=26.9247389,75.8244663"
                },
                {
                    "name": "Hawa Mahal",
                    "type": "attraction",
                    "maps_link": "https://www.google.com/maps?q=26.923932,75.8268652"
                },
                {
                    "name": "Pink City (Pink City)",
                    "type": "attraction",
                    "maps_link": "https://www.google.com/maps?q=26.9232015,75.8243929"
                },
                {
                    "name": "Albert hall",
                    "type": "museum",
                    "maps_link": "https://www.google.com/maps?q=26.9117053,75.8194973"
                },
                {
                    "name": "Iswari Minar",
                    "type": "viewpoint",
                    "maps_link": "https://www.google.com/maps?q=26.9244425,75.8208167"
                }
            ],
            "message": "Data Updated Successfully"
          };

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
             <Text style={styles.header}>Travel</Text>
            {travelLinks.Ola && (
              <View style={styles.travelSection}>
                <Image source={{ uri: 'https://cdn-bclnh.nitrocdn.com/HrhbFpIEQgeThoExdTufdJjReiWCKhjs/assets/images/optimized/rev-9a3864c/www.fugenx.com/wp-content/uploads/2018/12/How-Much-Does-it-Cost-to-Develop-an-App-like-Ola.jpg' }} style={styles.travelImage} />
                <Text style={styles.heading}>Ola</Text>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => {
                    console.log("Opening Ola URL:", travelLinks.Ola);
                    Linking.openURL(travelLinks.Ola);
                  }}
                >
                  <Text style={styles.buttonText}>Open Ola</Text>
                </TouchableOpacity>
              </View>
            )}
            {travelLinks.Uber && (
              <View style={styles.travelSection}>
                
                <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSj58VB-lmoKmOORTTTjiJ2FWAoXd8DABO3yH1RYlR0tvJF89VhCKB_yQAwa2dVV7iYIY&usqp=CAU' }} style={styles.travelImage} />
                <Text style={styles.heading}>Uber</Text>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => {
                    console.log("Opening Uber URL:", travelLinks.Uber);
                    Linking.openURL(travelLinks.Uber);
                  }}
                >
                  <Text style={styles.buttonText}>Open Uber</Text>
                </TouchableOpacity>
              </View>
            )}
            {travelLinks.Map && (
              <View style={styles.travelSection}>
                <Text style={styles.heading}>Map</Text>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => {
                    console.log("Opening Map URL:", travelLinks.Map);
                    Linking.openURL(travelLinks.Map);
                  }}
                >
                  <Text style={styles.buttonText}>Open Map</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {cardType === "Local Attractions" && (
          <View style={styles.attractionsContainer}>
            <Text style={styles.header}>Local Attractions</Text>
            {attractions.length > 0 ? (
              attractions.map((attraction, index) => {
                console.log("Rendering Attraction:", attraction);
                return (
                  <View key={index} style={styles.attractionCard}>
                    <Text style={styles.attractionName}>{attraction.name}</Text>
                    <Text>{attraction.type}</Text>
                    <TouchableOpacity
                      style={styles.buttonContainer}
                      onPress={() => {
                        console.log("Opening Attraction Map Link:", attraction.maps_link);
                        Linking.openURL(attraction.maps_link);
                      }}
                    >
                      <Text style={styles.buttonText}>View on Map</Text>
                    </TouchableOpacity>
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
    alignItems: 'center',  
  },
  travelImage: {
    width: 350,
    height: 150,
    marginBottom: 10,
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

  header: {
    fontSize: 24,
    fontFamily: "Baskervville_400Regular",
    marginTop:20, 
    marginBottom:20, 
  },

  heading: {
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
  },
  attractionName: {
    fontSize: 16,
    fontFamily: "PTSans_400Regular",

  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: "#D08A76",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Montserrat_400Regular", 
    color: "#FFF",
  },
});

export default TravelDetails;