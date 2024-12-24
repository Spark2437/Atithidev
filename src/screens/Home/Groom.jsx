import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Groom = () => {
  const groomDescription =
    "Rohit, a business professional born and raised in Delhi, holds a degree in Business Administration. With a passion for growth and exploration, he loves tackling challenges head-on. In his free time, Rohit enjoys playing cricket, traveling to new destinations, and discovering unique cuisines.";

  return (
    <LinearGradient colors={["#f4f4f4", "#d3c6b3"]} style={styles.gradientContainer}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Meet the Groom</Text>
          <Text style={styles.description}>{groomDescription}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

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
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});

export default Groom;
