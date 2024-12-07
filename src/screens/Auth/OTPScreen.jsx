import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";  // Ensure AsyncStorage is imported correctly

const OTPScreen = ({ route, navigation, setUserId }) => {
  const [Otp, setOtp] = useState(""); // Changed variable name to 'Otp' to match the API
  const { mobile, name } = route.params; // Extract mobile and name from route params

  const handleVerifyOTP = async () => {
    if (!Otp) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }

    try {
      // API call to verify OTP along with mobile number and name
      const response = await fetch("https://guest-event-app.onrender.com/api/Verify-Otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, name, Otp }),
      });

      const data = await response.json();
      if (data.status_code === 200 && data.Profile) {
        const userId = data.Profile.UserId;
        console.log("UserID from OTP:", userId);
        // Save the userId to AsyncStorage
        await AsyncStorage.setItem("userId", userId);
        const storedUserId = await AsyncStorage.getItem("userId");
        console.log("Stored userId:", storedUserId);

        setUserId(userId);

      
        navigation.navigate("AllEvents");  
      } else {
        Alert.alert("Error", "OTP verification failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };


  return (
    <View>
      <Text>Enter OTP for {name}</Text>
      <TextInput
        value={Otp}
        onChangeText={setOtp}
        placeholder="Enter OTP"
        keyboardType="numeric"
        style={{ borderWidth: 1, margin: 10, padding: 8 }}
      />
      <Button title="Verify OTP" onPress={handleVerifyOTP} />
    </View>
  );
};

export default OTPScreen;
