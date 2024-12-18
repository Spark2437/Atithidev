import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const ProfileScreen = ({ route, navigation }) => {
  const { UserId, eventUUID } = route.params;
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch profile data
    fetch("https://guest-event-app.onrender.com/api/UserComingDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ UserId, EventUUID: eventUUID }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status_code === 200) {
          setProfileData(data.Data);
        } else {
          Alert.alert("Error", "Failed to fetch profile data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
        Alert.alert("Error", "Unable to fetch profile data.");
      })
      .finally(() => setLoading(false));
  }, [UserId, eventUUID]);

  if (loading)
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#D08A76" />
      </View>
    );

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
            <Text style={styles.errorText}>No profile data available.</Text>
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
    fontWeight: "bold",
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
  },
});

export default ProfileScreen;
