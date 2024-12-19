import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const ProfileScreen = ({ route, navigation }) => {
  const { UserId, eventUUID } = route.params;
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    console.log("Fetching profile data with:", { UserId, eventUUID });

    fetch("https://guest-event-app.onrender.com/api/UserComingDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ UserId, EventUUID: eventUUID }),
    })
      .then((response) => {
        console.log("API Response received:", response);
        return response.json();
      })
      .then((data) => {
        console.log("Parsed response data:", data);

        if (data.status_code === 200 && data.Data) {
          console.log("Profile data fetched successfully:", data.Data);
          setProfileData(data.Data);
        } else {
          console.log("No profile data found or invalid response.");
          setProfileData(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
        setProfileData(null);
      })
      .finally(() => {
        console.log("Data fetching completed.");
        setLoading(false);
      });
  }, [UserId, eventUUID]);

  console.log("Rendering profile screen with profileData:", profileData);

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Profile Details</Text>
          {profileData ? (
            <>
              <Text style={styles.detailText}>Status: {profileData.Status}</Text>
              <Text style={styles.detailText}>
                Travel Date: {profileData.TravelDate}
              </Text>
            </>
          ) : (
            <Text style={styles.errorText}>
              No profile data available. Please fill RSVP.
            </Text>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 24,
    fontFamily: "Montserrat_400Regular", 
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: "PTSans_400Regular",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
  },
});

export default ProfileScreen;
