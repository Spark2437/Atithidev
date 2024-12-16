import * as React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

function HostFamily({ route, navigation }) {
  
  const { eventUUID } = route.params;
  console.log("Event UUID:", eventUUID); 
  
  const fetchFamilyDetails = async (side) => {
    try {
      const response = await fetch('https://guest-event-app.onrender.com/api/Familydetailsbyuuid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          EventUUID: eventUUID,
          Side: side, 
        }),
      });

      const data = await response.json();
      if (data.status_code === 200) {
       
        navigation.navigate(side + "FamilyDetails", {
          familyDetails: data,
          eventUUID: eventUUID, 
          side: side, 
        });
      } else {
        console.error("Error fetching data:", data.Remark);
      }
    } catch (error) {
      console.error("API request failed:", error);
    }
  };

  return (
    <LinearGradient
      colors={['rgba(232, 198, 188, 0.8)', 'rgba(146, 101, 89, 0.5)']} 
      locations={[0.3, 0.9]}
      style={styles.gradientContainer} 
    >
      <View style={styles.container}>
        {/* Groom Family Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => fetchFamilyDetails("Groom")}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: "https://plus.unsplash.com/premium_photo-1682090840373-b06b5237ae74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFtaWx5JTIwd2VkZGluZyUyMGluZGlhbnxlbnwwfDB8MHx8fDA%3D",
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Groom Family</Text>
            <Text style={styles.description}>Get to know the Groom's Family, and some Fun Facts About Them.</Text>
          </View>
        </TouchableOpacity>

        {/* Bride Family Card */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => fetchFamilyDetails("Bride")}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: "https://plus.unsplash.com/premium_photo-1729038880168-b9123602b10b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFtaWx5JTIwd2VkZGluZyUyMGluZGlhbnxlbnwwfDB8MHx8fDA%3D",
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Bride Family</Text>
            <Text style={styles.description}>Get to know the Bride's Family, and some Fun Facts About Them.</Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

export default HostFamily;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1, // Ensuring gradient covers the entire screen
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: 300,
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
  },
  imageContainer: {
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
});
