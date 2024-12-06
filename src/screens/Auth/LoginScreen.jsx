import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const LoginScreen = ({ navigation }) => {
  const [name, setName] = useState(""); // State for the user's name
  const [mobile, setMobile] = useState(""); // State for mobile number
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    console.log("Entered Name:", name);
    console.log("Entered Mobile Number:", mobile);

    // Validate mobile number
    if (!mobile || mobile.length !== 10 || isNaN(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://guest-event-app.onrender.com/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile }), // Send mobile number for OTP
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        alert(`Error: ${errorData.reason || "Failed to send OTP"}`);
        return;
      }

      const data = await response.json();
      console.log("API Response (Send OTP):", data);

      if (data.status_code === 200) {
        alert("OTP sent successfully");
        // Pass only mobile to the OTP screen
        navigation.navigate("OTPScreen", { mobile });
      } else {
        alert("Error in sending OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]}
      style={styles.container}
    >

      <Text style={styles.heading}>Enter Your Mobile Number</Text>
      
      {/* Name input (optional, not sent to OTP screen) */}
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />

      {/* Mobile input */}
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="numeric"
        maxLength={10}
      />

      {/* Button to verify OTP */}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
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
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  image: {
    width: 100, // Adjust width as needed
    height: 100, // Adjust height as needed
    marginBottom: 20, // Space between image and heading
    borderRadius: 50, // Optional, to make the image circular
  },
  input: {
    width: "100%",
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#D08A76",  // Matching the event button color
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

export default LoginScreen;
