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
                  uri: "data:image/jpeg;base64,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",
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
