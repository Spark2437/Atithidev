import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient

const ViewDetails = ({ route }) => {
  const navigation = useNavigation(); // Get the navigation object using the hook
  const { eventUUID } = route.params; // Extract the eventUUID from route.params

  // Log the eventUUID to verify it's being passed correctly
  console.log("Event UUID in ViewDetails:", eventUUID);

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      locations={[0.3, 0.9]}
      style={styles.gradientContainer} // Apply gradient to the entire background
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Card 1: Host Family */}
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("HostFamily", {
                eventUUID: eventUUID, // Pass the eventUUID to the EventSchedule screen
              })
            }
          >
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOOezK-E_vTwniW-dKkVxXGlhQYo0jE3kqCQ&s",
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Host Family</Text>
              <Text style={styles.description}>
                Information about the bride and groom's families.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Card 2: Event Schedule */}
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("EventSchedule", {
                eventUUID: eventUUID, // Pass the eventUUID to the EventSchedule screen
              })
            }
          >
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: "https://cdn.hswstatic.com/gif/maps.jpg",
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Event Schedule</Text>
              <Text style={styles.description}>
                Detailed schedule for all wedding events.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Card 3: Travel and Accommodation 
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Travel")}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: "https://via.placeholder.com/80",
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Travel and Accommodation</Text>
              <Text style={styles.description}>
                Accommodation details for guests attending the wedding.
              </Text>
            </View>
          </TouchableOpacity> */}

          {/* Card 4: Sagun Card */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Gift")}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1586957960362-65815d739527?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGVudmVsb3BlfGVufDB8MHwwfHx8MA%3D%3D",
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Sagun Card</Text>
              <Text style={styles.description}>
                Send your warmest wishes to the couple.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Card 4: Vendors */}
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Vendors", {
                eventUUID: eventUUID, // Pass the Vendors to the Vendors
              })
            }
          >
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: "data:image/jpeg;base64,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",
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Vendors</Text>
              <Text style={styles.description}>Detailed of Vendors.</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
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
    marginTop: 20,
  },
  card: {
    backgroundColor: "#E0E0E0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
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
    justifyContent: "space-between",
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
    marginBottom: 10,
  },
});

export default ViewDetails;
