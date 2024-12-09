import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const RSVP = ({ route, navigation }) => {
  const { eventUUID } = route.params; 
  const [userId, setUserId] = useState(null); 
  const [response, setResponse] = useState(null); 
  console.log("Event UUID:", eventUUID);  

  // Fetch Event Details and Extract UserId
  useEffect(() => {
    fetch("https://guest-event-app.onrender.com/api/eventdetailsbyuuid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ EventUUID: eventUUID }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status_code === 200 && data.Data?.length > 0) {
          setUserId(data.Data[0].UserId); 
          console.log("Fetched UserId:", data.Data[0].UserId); 
        } else {
          Alert.alert("Error", "Unable to fetch User ID.");
        }
      })
      .catch((err) => Alert.alert("Error", "Error fetching User ID: " + err.message));
  }, [eventUUID]);

  // Handle RSVP submission
  const handleSubmit = () => {
    if (!response) {
      Alert.alert("Incomplete", "Please select an option before submitting.");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID is missing.");
      return;
    }

    // Log the values before submitting
    console.log("Submitting RSVP with UserId:", userId);
    console.log("EventUUID:", eventUUID);
    console.log("Response:", response);

    // Submit RSVP response
    fetch("https://guest-event-app.onrender.com/api/ComingornotStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserId: userId,
        EventUUID: eventUUID,
        Status: response,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status_code === 200) {
          Alert.alert("Success", "Your response has been submitted.");
          navigation.goBack(); // Navigate back to the previous screen
        } else {
          Alert.alert("Error", data.message || "Failed to submit RSVP.");
        }
      })
      .catch((err) => Alert.alert("Error", "Submission failed: " + err.message));
  };

  return (
    <LinearGradient colors={["#f4f4f4", "#d3c6b3"]} style={styles.gradientContainer}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>PLEASE REPLY</Text>
          <Text style={styles.info}>
            Invite You to Share{'\n'}in the Joy of Our Marriage
          </Text>

          {/* Options */}
          <View style={styles.subheadingContainer}>
            {RSVP_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.checkboxContainer}
                onPress={() => setResponse(option)}
              >
                <View style={[styles.checkbox, response === option && styles.selectedCheckbox]}>
                  {response === option && <Text style={styles.checkboxText}>✓</Text>}
                </View>
                <Text style={styles.subheading}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const RSVP_OPTIONS = ["Happily Attending", "Sadly Declining"];

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 30,
    width: "90%",
    borderColor: "#D4AF37",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#C19264",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  subheadingContainer: {
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    borderWidth: 2,
    borderRadius: 5,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderColor: "#555",
  },
  selectedCheckbox: {
    backgroundColor: "#D4AF37",
  },
  checkboxText: {
    fontSize: 18,
    color: "#fff",
  },
  subheading: {
    fontSize: 16,
    color: "#555",
  },
  submitButton: {
    backgroundColor: "#C19264",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  submitButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RSVP;
