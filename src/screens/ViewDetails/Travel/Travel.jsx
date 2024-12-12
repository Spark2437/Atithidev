import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const Travel = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventUUID } = route.params || {};

  console.log("Travel Screen Loaded");
  console.log("Received eventUUID:", eventUUID);

  const details = [
    {
      title: "Travel",
      description: "Explore various destinations",
      amenities: "Guided tours, Transportation",
      imageUri: "https://newsroom.aaa.com/wp-content/uploads/2023/10/iStock-816320512-1024x453.jpg",
      cardType: "Travel",
    },
    {
      title: "Local Attractions",
      description: "Explore nearby places",
      amenities: "Museums, Parks, Historical Sites",
      imageUri: "https://entrepreneuronemedia.com/wp-content/uploads/2022/04/blog-cover1.jpg",
      cardType: "Local Attractions",
    },
  ];

  const handleCardPress = (item) => {
    console.log("Card Pressed:", item);
    console.log("Navigating to TravelDetails with cardType:", item.cardType);
    navigation.navigate("TravelDetails", { eventUUID, cardType: item.cardType });
  };

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      locations={[0.3, 0.9]}
      style={styles.container}
    >
      <ScrollView>
        {details.map((item, index) => {
          console.log("Rendering card:", item.title);
          return (
            <TouchableOpacity key={index} onPress={() => handleCardPress(item)}>
              <View style={styles.card}>
                <Image source={{ uri: item.imageUri }} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.amenities}>{item.amenities}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    marginVertical: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  textContainer: {
    padding: 15,
    marginTop: -10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginVertical: 1,
  },
  amenities: {
    fontSize: 14,
    color: "#555",
    marginVertical: 1,
  },
});

export default Travel;
