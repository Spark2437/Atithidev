import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient"; // Import the LinearGradient component

const Travel = () => {
  const navigation = useNavigation(); // Hook to access navigation

  const details = [
    {
      title: "Your Accommodations Details",
      location: "XYZ Palace, Delhi",
      amenities: "Free Wi-Fi, Pool",
      imageUri: "data:image/jpeg;base64,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",
    },
    {
      title: "Prescheduled Picks Ups and Drops",
      location: "By 10:00am",
      imageUri:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdOK6dvOiOztMwv6nfDD7tgaR36crDNRnC7w&s",
    },
    {
      title: "Local Attractions",
      location: "A Bar",
      amenities: "",
      imageUri:
        "https://upload.wikimedia.org/wikipedia/commons/2/2e/Dublin_City_Alcohol.jpg",
    },
  ];

  const handleCardPress = (item) => {
    navigation.navigate("TravelDetails", { details: item }); // Navigate to TravelDetails with data
  };

  return (
    <LinearGradient
    colors={['rgba(232, 198, 188, 0.8)', 'rgba(146, 101, 89, 0.5)']}
    locations={[0.3, 0.9]}
      style={styles.container}
    >
      <ScrollView>
        {details.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleCardPress(item)}>
            <View style={styles.card}>
              <Image source={{ uri: item.imageUri }} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.location}>{item.location}</Text>
                <Text style={styles.amenities}>{item.amenities}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 40,
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
  location: {
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
