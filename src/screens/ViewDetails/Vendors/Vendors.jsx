import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Vendors = ({ route, navigation }) => {
  const [vendorsData, setVendorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { eventUUID } = route.params;

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await fetch(
          "https://guest-event-app.onrender.com/api/VendorDetailsbyuuid",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ EventUUID: eventUUID }),
          }
        );

        const data = await response.json();

        if (data.status_code === 200) {
          const filteredVendors = data.Data.filter((category) =>
            category.Image.some((vendor) => vendor.EventUUID === eventUUID)
          );
          setVendorsData(filteredVendors);
        } else {
          console.error("API request failed:", data.Remark);
        }
      } catch (error) {
        console.error("Error fetching vendor data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [eventUUID]);

  const handleVendorClick = (vendorUUID) => {
    navigation.navigate("VendorDetails", { vendorUUID, eventUUID });
  };

  const renderVendorItem = ({ item }) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{item.Category}</Text>
      <FlatList
        data={item.Image}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleVendorClick(item.VendorUUID)}
            style={styles.card}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.VendorImage }} style={styles.image} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.VendorName}</Text>
              <Text style={styles.description}>{item.VendorType}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(vendor) => vendor.VendorUUID}
        horizontal
      />
    </View>
  );

  if (loading) {
    return (
      <LinearGradient
        colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
        locations={[0.3, 0.9]}
        style={styles.gradientContainer}
      >
        <View style={styles.loaderContainer}>
          <Text>Loading vendors...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (vendorsData.length === 0) {
    return (
      <LinearGradient
        colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
        locations={[0.3, 0.9]}
        style={styles.gradientContainer}
      >
        <View style={styles.loaderContainer}>
          <Text>No vendors available for this event.</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      locations={[0.3, 0.9]}
      style={styles.gradientContainer}
    >
      <FlatList
        contentContainerStyle={styles.container}
        data={vendorsData}
        renderItem={renderVendorItem}
        keyExtractor={(category) => category.Category}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    marginTop: 30,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
   
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginRight: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Vendors;
