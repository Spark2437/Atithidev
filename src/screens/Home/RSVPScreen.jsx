import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const RSVP = ({ route, navigation }) => {
  const { UserId, eventUUID } = route.params; 
  const [response, setResponse] = useState(null);
  const [travelDate, setTravelDate] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState({}); 

  useEffect(() => {
    console.log("useEffect: Checking if the user has already submitted RSVP for eventUUID:", eventUUID);
    console.log("useEffect: UserId from route params:", UserId); 

  
    if (rsvpStatus[eventUUID]) {
      console.log("RSVP already submitted for this event:", rsvpStatus[eventUUID]);
      Alert.alert("You have already submitted your RSVP.");
      navigation.goBack("EventDetails");
    }
  }, [rsvpStatus, eventUUID, UserId, navigation]); 

  const handleOptionSelect = (option) => {
    console.log("handleOptionSelect: Selected option:", option);
    console.log("handleOptionSelect: UserId:", UserId); 
    setResponse(option);
    if (option === "Happily Attending") {
      console.log("Option 'Happily Attending' selected, showing travel date form.");
      setIsFormVisible(true); 
    } else {
      console.log("Option 'Sadly Declining' selected, hiding travel date form.");
      setIsFormVisible(false); 
    }
  };

  const handleSubmit = async () => {
    console.log("handleSubmit: Submitting RSVP with response:", response, "and travelDate:", travelDate);
    console.log("handleSubmit: UserId:", UserId); 

    if (!response) {
      console.log("Incomplete RSVP submission: No option selected.");
      Alert.alert("Incomplete", "Please select an option before submitting.");
      return;
    }

    if (response === "Happily Attending" && !travelDate) {
      console.log("Incomplete RSVP submission: Travel Date is required for 'Happily Attending'.");
      Alert.alert("Incomplete", "Please fill in your Travel Date.");
      return;
    }

    try {

      const updatedRsvpStatus = { ...rsvpStatus, [eventUUID]: response };
      console.log("Updating local RSVP status:", updatedRsvpStatus);
      setRsvpStatus(updatedRsvpStatus);

      
      const rsvpResponse = await fetch("https://guest-event-app.onrender.com/api/ComingornotStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserId: UserId, 
          EventUUID: eventUUID,
          Status: response,
          TravelDate: travelDate,  
        }),
      });
      const rsvpData = await rsvpResponse.json();
      console.log("RSVP submission response from server:", rsvpData);

      if (rsvpData.status_code === 200) {
        console.log("RSVP submission successful.");
        Alert.alert("Success", "Your response has been submitted.");
        navigation.navigate("EventDetails", { eventUUID });
      } else {
        console.log("Error in RSVP submission:", rsvpData.message);
        Alert.alert("Error", rsvpData.message || "Failed to submit RSVP.");
      }
    } catch (err) {
      console.log("Error in submitting RSVP:", err.message);
      Alert.alert("Error", "Submission failed: " + err.message);
    }
  };

  return (
    <LinearGradient colors={["#f4f4f4", "#d3c6b3"]} style={styles.gradientContainer}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>PLEASE REPLY</Text>
          <Text style={styles.info}>
            Invite You to Share{'\n'}in the Joy of Our Marriage
          </Text>

          {/* RSVP Options */}
          <View style={styles.subheadingContainer}>
            {RSVP_OPTIONS.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.checkboxContainer}
                onPress={() => handleOptionSelect(option)}
              >
                <View style={[styles.checkbox, response === option && styles.selectedCheckbox]}>
                  {response === option && <Text style={styles.checkboxText}>✓</Text>}
                </View>
                <Text style={styles.subheading}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Form for Happily Attending */}
          {isFormVisible && (
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Travel Date (YYYY-MM-DD)"
                value={travelDate}
                onChangeText={setTravelDate}
              />
            </View>
          )}

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
  form: {
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: "100%",
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
