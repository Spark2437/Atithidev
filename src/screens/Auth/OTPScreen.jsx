import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../contexts/UserContext"; // Import the useUser hook
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient for gradient background

const OTPScreen = ({ route }) => {
  const [otp, setOtp] = useState(""); // OTP input state
  const [isLoading, setIsLoading] = useState(false); // Loading state for button
  const { mobile, name } = route.params; // Get mobile and name from LoginScreen
  const { saveUserId } = useUser(); // Access the saveUserId function from context
  const navigation = useNavigation(); // Navigation object

  // References for each OTP input
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Function to handle OTP verification
  const verifyOTP = async () => {
    if (!otp || otp.length !== 4) {
      Alert.alert("Invalid OTP", "Please enter a valid 4-digit OTP.");
      return;
    }

    setIsLoading(true); // Set loading state

    try {
      const response = await fetch("https://guest-event-app.onrender.com/api/Verify-Otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Otp: otp, mobile, Username: name }), // Send username here
      });

      const text = await response.text(); // Get raw response text
      console.log("Raw Response: ", text); // Log raw response

      try {
        const data = JSON.parse(text); // Manually parse the JSON
        if (response.ok && data.status_code === 200) {
          saveUserId(data.Profile.UserId); // Save UserId
          Alert.alert("Success", "OTP verified successfully!");
          navigation.reset({
            index: 0,
            routes: [{ name: "AllEvents" }], // Navigate to AllEvents screen
          });
        } else {
          Alert.alert("Error", "OTP verification failed.");
        }
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        Alert.alert("Error", "Response format is invalid.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", "An error occurred while verifying OTP.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Function to handle OTP input field change (for each digit)
  const handleOtpChange = (text, index) => {
    if (/^[0-9]{0,1}$/.test(text)) {
      const updatedOtp = otp.split("");
      updatedOtp[index] = text; // Update the specific digit in OTP
      setOtp(updatedOtp.join(""));

      // Move focus to next input if current field is filled
      if (text && index < 3) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]} // Gradient colors
      style={styles.container}
    >
      {/* Image Above Heading 
      <Image 
        source={require("../../../ass")} // Adjust the path to your image
        style={styles.image}
      />*/}

      <Text style={styles.heading}>Enter Verification Code</Text>
      <Text style={styles.subHeading}>Sent to: {mobile}</Text>

      <View style={styles.otpContainer}>
        {/* OTP Input Fields */}
        {[...Array(4)].map((_, index) => (
          <TextInput
            key={index}
            ref={inputRefs[index]} // Assign ref to each TextInput
            style={styles.otpBox}
            value={otp[index] || ""}
            onChangeText={(text) => handleOtpChange(text, index)} // Handle input change
            keyboardType="numeric"
            maxLength={1} // Restrict input to 1 digit
          />
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={verifyOTP}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify OTP</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 100, // Adjust the size of the image as needed
    height: 100,
    marginBottom: 20, // Space between the image and the heading
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subHeading: {
    fontSize: 16,
    marginBottom: 20,
    color: "#555",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 30,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 24,
    textAlign: "center",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#D08A76", // Matching the event button color
    padding: 15,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#7da3d3", // Light disabled button color
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default OTPScreen;
