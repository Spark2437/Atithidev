import React, { useState } from "react";  
import { StyleSheet, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";  
import { Baskervville_400Regular } from "@expo-google-fonts/baskervville";
import { Roboto_400Regular } from "@expo-google-fonts/roboto";
import { Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import { PTSans_400Regular } from '@expo-google-fonts/pt-sans';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';

const LoginScreen = () => {
  const [name, setName] = useState("");  
  const [mobile, setMobile] = useState("");  
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();


  const [] = useFonts({
    Baskervville_400Regular,
    Roboto_400Regular,
    Montserrat_400Regular,
    PTSans_400Regular,
    Poppins_400Regular,
  });

  const handleLogin = async () => {
    console.log("Entered Name:", name);
    console.log("Entered Mobile Number:", mobile);
  
    // Validation checks
    if (!mobile || mobile.length !== 10 || isNaN(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
  
    if (!name || name.trim().length === 0) {
      alert("Please enter your name.");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch("https://guest-event-app.onrender.com/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, mobile }),  
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
        navigation.navigate("OTPScreen", { name, mobile });  
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
      <Text style={[styles.heading, { fontFamily: "Poppins_400Regular" }]}>Enter Your Number</Text>
      
      <TextInput
        style={[styles.input, { fontFamily: "Roboto_400Regular" }]}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, { fontFamily: "Roboto_400Regular" }]} 
        placeholder="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="numeric"
        maxLength={10}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={[styles.buttonText, { fontFamily: "Montserrat_400Regular" }]}>Verify </Text>  
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
    marginBottom: 20,
    color: "#333",
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
    fontSize: 18,
  },
});

export default LoginScreen;
