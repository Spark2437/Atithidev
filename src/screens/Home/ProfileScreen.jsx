import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const ProfileScreen = ({ route, navigation }) => {
  const { UserId, eventUUID } = route.params;
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [newTravelDate, setNewTravelDate] = useState("");  

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

  const handleUpdateProfile = async () => {
    if (!newStatus || !newTravelDate) {
      Alert.alert("Incomplete", "Please fill in both status and travel date.");
      return;
    }

    console.log("Updating profile with new data:", { newStatus, newTravelDate });

    try {
      const response = await fetch("https://guest-event-app.onrender.com/api/UserProfileDatabyuuid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Status: newStatus,
          TravelDate: newTravelDate,
          UserId,
          EventUUID: eventUUID,
        }),
      });

      const data = await response.json();
      console.log("API Response received for update:", data);

      if (data.status_code === 200) {
        console.log("Profile updated successfully:", data.Data);
        Alert.alert("Success", "Your profile has been updated.");
        setProfileData(data.Data);  // Update profile data after successful update
      } else {
        console.log("Failed to update profile:", data.message);
        Alert.alert("Error", data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "An error occurred while updating your profile.");
    }
  };

  console.log("Rendering profile screen with profileData:", profileData);

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Profile Details</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#C19264" />
          ) : profileData ? (
            <>
              <Text style={styles.detailText}>Status: {profileData.Status}</Text>
              <Text style={styles.detailText}>Travel Date: {profileData.TravelDate}</Text>

              <Text style={styles.update}>Have Some Other Plans?</Text>
              
              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="New Status"
                  value={newStatus}
                  onChangeText={setNewStatus}
                />
                <TextInput
                  style={styles.input}
                  placeholder="New Travel Date (YYYY-MM-DD)"
                  value={newTravelDate}
                  onChangeText={setNewTravelDate}
                />
              </View>

              <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
                <Text style={styles.updateButtonText}>Update Profile</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.errorText}>No profile data available. Please fill RSVP.</Text>
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
  form: {
    marginVertical: 20,
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: "100%",
  },
   update: {
    fontSize: 24,
    fontFamily: "Montserrat_400Regular",
    marginTop: 20,
   }, 
   
  updateButton: {
    backgroundColor: "#D08A76",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  updateButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
