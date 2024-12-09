import React, { useState, useRef } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const OTPScreen = ({ route, navigation }) => {
  const { mobile, name } = route.params;
  const [Otp, setOtp] = useState(["", "", "", ""]); // 4 OTP digits
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef([]);

  const handleVerifyOTP = async () => {
    if (Otp.some((digit) => digit === "")) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }

    setIsLoading(true);

    try {
      const otpString = Otp.join(""); // Combine OTP digits into a single string

      const response = await fetch("https://guest-event-app.onrender.com/api/Verify-Otp1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, name, Otp: otpString }),
      });

      const data = await response.json();
      if (data.status_code === 200 && data.Profile) {
        navigation.navigate("Main");
      } else {
        Alert.alert("Error", "OTP verification failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeText = (text, index) => {
    if (text.length > 1) return; // Only one digit per box

    const newOtp = [...Otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < Otp.length - 1) {
      inputRefs.current[index + 1].focus(); // Move to the next input
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && Otp[index] === "") {
      inputRefs.current[index - 1].focus(); // Move to the previous input if backspace is pressed
    }
  };

  return (
    <LinearGradient colors={["rgba(232, 198, 188, 0.8)", "rgba(146, 101, 89, 0.5)"]} style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.heading}>Enter Verification Code</Text>
        <View style={styles.otpContainer}>
          {Otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => inputRefs.current[index] = ref}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              style={styles.otpBox}
            />
          ))}
        </View>
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleVerifyOTP}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "transparent",
  },
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: 400, // Optional: Limiting the max width for better control
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center the OTP boxes horizontally
    width: "60%",  // or adjust as per your preference
    marginBottom: 40,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#fff",
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: "#D08A76",
    padding: 15,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#7da3d3",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default OTPScreen;
